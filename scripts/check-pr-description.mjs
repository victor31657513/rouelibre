import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const REQUIRED_SECTIONS = [
  '## Objectif',
  '## État initial vérifié',
  '## Périmètre',
  '## Hors périmètre',
  '## Fichiers modifiés',
  '## Choix et hypothèses',
  '## Tests exécutés',
  '## Résultats observables',
  '## Documentation mise à jour',
  '## Risques et limites',
  '## Impact sur les performances',
  '## Prochaine tâche suggérée',
];

const HEADING_PATTERN = /^## [^#\r\n].*$/gm;
const FORBIDDEN_PLACEHOLDERS = /^(?:TODO|TBD|à compléter|N\/?A|RAS)$/iu;

function meaningfulContent(content) {
  const withoutComments = content.replace(/<!--[\s\S]*?-->/g, '');
  const normalized = withoutComments
    .replace(/^\s*(?:[-*+]\s*|\d+[.)]\s*)$/gm, '')
    .trim();

  if (normalized === '') return { valid: false, placeholder: false };
  if (FORBIDDEN_PLACEHOLDERS.test(normalized)) {
    return { valid: false, placeholder: true };
  }
  return { valid: true, placeholder: false };
}

export function validatePrDescription(body) {
  const errors = [];
  const occurrences = new Map(REQUIRED_SECTIONS.map((section) => [section, []]));

  for (const match of body.matchAll(HEADING_PATTERN)) {
    if (occurrences.has(match[0])) occurrences.get(match[0]).push(match.index);
  }

  for (const section of REQUIRED_SECTIONS) {
    const positions = occurrences.get(section);
    if (positions.length === 0) errors.push(`Missing required section: "${section}"`);
    if (positions.length > 1) errors.push(`Required section appears more than once: "${section}"`);
  }

  const uniqueSections = REQUIRED_SECTIONS.filter(
    (section) => occurrences.get(section).length === 1,
  );
  for (let index = 1; index < uniqueSections.length; index += 1) {
    const previous = uniqueSections[index - 1];
    const current = uniqueSections[index];
    if (occurrences.get(previous)[0] > occurrences.get(current)[0]) {
      errors.push(`Section order is invalid: "${previous}" must appear before "${current}"`);
      break;
    }
  }

  for (const section of REQUIRED_SECTIONS) {
    const positions = occurrences.get(section);
    if (positions.length !== 1) continue;
    const start = positions[0] + section.length;
    HEADING_PATTERN.lastIndex = start;
    const nextHeading = HEADING_PATTERN.exec(body);
    HEADING_PATTERN.lastIndex = 0;
    const content = body.slice(start, nextHeading?.index ?? body.length);
    const result = meaningfulContent(content);
    if (result.placeholder) {
      errors.push(`Section "${section}" contains a forbidden placeholder`);
    } else if (!result.valid) {
      errors.push(`Section "${section}" does not contain meaningful content`);
    }
  }

  return errors;
}

function readBody(args, environment) {
  const eventFileIndex = args.indexOf('--event-file');
  if (eventFileIndex !== -1) {
    const file = args[eventFileIndex + 1];
    if (!file) throw new Error('Missing path after --event-file');
    const event = JSON.parse(readFileSync(file, 'utf8'));
    return event.pull_request?.body ?? '';
  }

  const bodyIndex = args.indexOf('--body');
  if (bodyIndex !== -1) {
    if (args[bodyIndex + 1] === undefined) throw new Error('Missing value after --body');
    return args[bodyIndex + 1];
  }

  if (environment.PR_BODY !== undefined) return environment.PR_BODY;
  throw new Error('Provide the PR body with --event-file, --body, or PR_BODY');
}

export function run(args = process.argv.slice(2), environment = process.env) {
  let body;
  try {
    body = readBody(args, environment);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 2;
  }

  const errors = validatePrDescription(body);
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    return 1;
  }
  console.log('Pull request description is valid.');
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = run();
}
