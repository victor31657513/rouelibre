import { describe, expect, it } from 'vitest';
import { REQUIRED_SECTIONS, validatePrDescription } from './check-pr-description.mjs';

const concreteContent = new Map([
  ['## Tests exécutés', '- `pnpm test` réussit.'],
  ['## Fichiers modifiés', '- `scripts/check-pr-description.mjs`'],
  ['## Résultats observables', 'Le validateur retourne le code 0 pour ce contenu.'],
]);

function validBody(overrides = new Map()) {
  return REQUIRED_SECTIONS.map(
    (section) => `${section}\n\n${overrides.get(section) ?? concreteContent.get(section) ?? `Réponse concrète pour ${section.slice(3)}.`}`,
  ).join('\n\n');
}

describe('validatePrDescription', () => {
  it('accepts a complete description in the required order', () => {
    expect(validatePrDescription(validBody())).toEqual([]);
  });

  it.each(REQUIRED_SECTIONS)('reports a missing section: %s', (section) => {
    const body = validBody().replace(new RegExp(`${section}\\n\\n[^\\n]+\\n?`), '');
    expect(validatePrDescription(body)).toContain(`Missing required section: "${section}"`);
  });

  it.each(['   ', '<!-- guide seulement -->', '-', '-\n-   '])(
    'rejects empty Markdown content %j',
    (content) => {
      const section = '## Objectif';
      expect(validatePrDescription(validBody(new Map([[section, content]])))).toContain(
        `Section "${section}" does not contain meaningful content`,
      );
    },
  );

  it.each(['TODO', 'TBD', 'à compléter', 'N/A', 'RAS'])(
    'rejects the placeholder %s',
    (content) => {
      const section = '## Risques et limites';
      expect(validatePrDescription(validBody(new Map([[section, content]])))).toContain(
        `Section "${section}" contains a forbidden placeholder`,
      );
    },
  );

  it('accepts an explained “Sans objet” response', () => {
    const body = validBody(new Map([
      ['## Impact sur les performances', 'Sans objet : cette PR ne modifie aucune boucle de simulation.'],
    ]));
    expect(validatePrDescription(body)).toEqual([]);
  });

  it('rejects a duplicated section', () => {
    const section = '## Périmètre';
    expect(validatePrDescription(`${validBody()}\n\n${section}\n\nEncore du contenu.`)).toContain(
      `Required section appears more than once: "${section}"`,
    );
  });

  it('rejects sections in the wrong order', () => {
    const first = '## Tests exécutés';
    const second = '## Résultats observables';
    const body = validBody()
      .replace(first, '## TEMPORAIRE')
      .replace(second, first)
      .replace('## TEMPORAIRE', second);
    expect(validatePrDescription(body)).toContain(
      `Section order is invalid: "${first}" must appear before "${second}"`,
    );
  });

  it('accepts paragraphs, populated lists, code blocks, commands, and paths', () => {
    const markdown = 'Un paragraphe.\n\n- élément renseigné\n\n```sh\npnpm test\n```\n\n`src/file.ts`';
    expect(validatePrDescription(validBody(new Map([['## Choix et hypothèses', markdown]])))).toEqual([]);
  });

  it('does not count template comments as content', () => {
    const body = validBody(new Map([['## Documentation mise à jour', '<!-- commentaire -->']]));
    expect(validatePrDescription(body)).toContain(
      'Section "## Documentation mise à jour" does not contain meaningful content',
    );
  });
});
