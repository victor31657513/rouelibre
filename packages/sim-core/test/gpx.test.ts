import { describe, expect, it } from "vitest";

import { parseGpxTrack } from "../src/index.js";

const wrap = (content: string, attributes = 'version="1.1" xmlns="http://www.topografix.com/GPX/1/1"'): string =>
  `<gpx ${attributes}>${content}</gpx>`;
const track = (points: string): string => `<trk><trkseg>${points}</trkseg></trk>`;
const point = (lat: string, lon: string, ele: string): string =>
  `<trkpt lat="${lat}" lon="${lon}"><ele>${ele}</ele></trkpt>`;
const validPoints = point("48.1", "2.2", "35") + point("48.2", "2.3", "36");

describe("parseGpxTrack", () => {
  it("analyse un GPX 1.1 minimal dans l'ordre documentaire", () => {
    const parsed = parseGpxTrack(`<?xml version="1.0" encoding="UTF-8"?>\n${wrap(track(validPoints))}`);
    expect(parsed.points).toEqual([
      { latitudeDegrees: 48.1, longitudeDegrees: 2.2, altitudeMeters: 35 },
      { latitudeDegrees: 48.2, longitudeDegrees: 2.3, altitudeMeters: 36 },
    ]);
  });

  it("accepte la mise en forme, les commentaires et les éléments supplémentaires", () => {
    const xml = wrap(`
      <!-- trace --> <trk><name>Test</name><trkseg>
        <trkpt lon='-1.2' lat='45.3'><time>2026-01-01T00:00:00Z</time><ele> -12.5 </ele></trkpt>
        <trkpt lat='46' lon='2'><ele>100</ele><extensions><value>ignored</value></extensions></trkpt>
      </trkseg></trk>`);
    expect(parseGpxTrack(xml).points).toEqual([
      { latitudeDegrees: 45.3, longitudeDegrees: -1.2, altitudeMeters: -12.5 },
      { latitudeDegrees: 46, longitudeDegrees: 2, altitudeMeters: 100 },
    ]);
  });

  it("accepte un export VisuGPX et ignore ses points de passage et ses CDATA", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
      <gpx xmlns="http://www.topografix.com/GPX/1/1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3"
        xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd"
        version="1.1" creator="VisuGPX - https://www.visugpx.com">
        <metadata><desc><![CDATA[Tour de France 2026]]></desc></metadata>
        <wpt lat="1" lon="2"><ele>999</ele><name><![CDATA[Départ]]></name></wpt>
        <trk>
          <name><![CDATA[Etape 1]]></name>
          <desc><![CDATA[Barcelone > Barcelone]]></desc>
          <extensions><gpxx:TrackExtension><gpxx:DisplayColor>Red</gpxx:DisplayColor></gpxx:TrackExtension></extensions>
          <trkseg>
            <trkpt lat="41.3874" lon="2.1686"><ele>12.5</ele><time>2026-07-04T10:00:00Z</time></trkpt>
            <trkpt lat="41.4036" lon="2.1744"><ele>18</ele><extensions><gpxx:RoutePointExtension /></extensions></trkpt>
          </trkseg>
        </trk>
      </gpx>`;

    const parsed = parseGpxTrack(xml);
    expect(parsed.points).toEqual([
      { latitudeDegrees: 41.3874, longitudeDegrees: 2.1686, altitudeMeters: 12.5 },
      { latitudeDegrees: 41.4036, longitudeDegrees: 2.1744, altitudeMeters: 18 },
    ]);
    expect(parsed.points).toHaveLength(2);
    expect(Object.isFrozen(parsed)).toBe(true);
    expect(Object.isFrozen(parsed.points)).toBe(true);
    expect(parsed.points.every(Object.isFrozen)).toBe(true);
  });

  it("compare les noms locaux d'un namespace préfixé", () => {
    const xml = `<x:gpx x:version="1.1" xmlns:x="http://www.topografix.com/GPX/1/1">
      <x:trk><x:trkseg><x:trkpt x:lat="1" x:lon="2"><x:ele>3</x:ele></x:trkpt>
      <x:trkpt x:lon="4" x:lat="5"><x:ele>6</x:ele></x:trkpt></x:trkseg></x:trk></x:gpx>`;
    expect(parseGpxTrack(xml).points).toHaveLength(2);
  });

  it("accepte les bornes des coordonnées et les altitudes négatives", () => {
    expect(parseGpxTrack(wrap(track(point("-90", "-180", " -5 ") + point("90", "180", "0")))).points)
      .toEqual([
        { latitudeDegrees: -90, longitudeDegrees: -180, altitudeMeters: -5 },
        { latitudeDegrees: 90, longitudeDegrees: 180, altitudeMeters: 0 },
      ]);
  });

  it("retourne un résultat profondément immuable et déterministe", () => {
    const first = parseGpxTrack(wrap(track(validPoints)));
    const second = parseGpxTrack(wrap(track(validPoints)));
    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.points)).toBe(true);
    expect(first.points.every(Object.isFrozen)).toBe(true);
    expect(() => {
      (first.points[0] as { latitudeDegrees: number }).latitudeDegrees = 0;
    }).toThrow(TypeError);
  });

  it.each([
    ["latitude absente", `<trkpt lon="2"><ele>3</ele></trkpt>${point("4", "5", "6")}`],
    ["longitude absente", `<trkpt lat="1"><ele>3</ele></trkpt>${point("4", "5", "6")}`],
    ["altitude absente", `<trkpt lat="1" lon="2"/>${point("4", "5", "6")}`],
    ["altitude dupliquée", `<trkpt lat="1" lon="2"><ele>3</ele><ele>4</ele></trkpt>${point("4", "5", "6")}`],
    ["altitude vide", `<trkpt lat="1" lon="2"><ele> </ele></trkpt>${point("4", "5", "6")}`],
    ["latitude dupliquée", `<trkpt lat="1" x:lat="2" lon="3"><ele>4</ele></trkpt>${point("4", "5", "6")}`],
  ])("rejette un champ obligatoire invalide : %s", (_label, points) => {
    expect(() => parseGpxTrack(wrap(track(points)))).toThrow(SyntaxError);
  });

  it.each([
    ["NaN", "2", "3"], ["Infinity", "2", "3"], ["1,5", "2", "3"],
    ["1&amp;0", "2", "3"], ["1", "2", "&amp;3"],
  ])("rejette une valeur numérique non décimale : %s", (lat, lon, ele) => {
    expect(() => parseGpxTrack(wrap(track(point(lat, lon, ele) + point("4", "5", "6")))))
      .toThrow(SyntaxError);
  });

  it.each([
    ["-90.1", "0"], ["90.1", "0"], ["0", "-180.1"], ["0", "180.1"],
  ])("rejette les coordonnées finies hors limites", (lat, lon) => {
    expect(() => parseGpxTrack(wrap(track(point(lat, lon, "0") + point("1", "1", "1")))))
      .toThrow(RangeError);
  });

  it.each([
    ["sans trk", wrap("<name>x</name>")],
    ["plusieurs trk", wrap(track(validPoints) + track(validPoints))],
    ["sans trkseg", wrap("<trk><name>x</name></trk>")],
    ["plusieurs trkseg", wrap(`<trk><trkseg>${validPoints}</trkseg><trkseg>${validPoints}</trkseg></trk>`)],
    ["un seul point", wrap(track(point("1", "2", "3")))],
    ["rtept seulement", wrap(`<trk><trkseg><rtept lat="1" lon="2"><ele>3</ele></rtept><wpt lat="4" lon="5"><ele>6</ele></wpt></trkseg></trk>`)],
    ["balise mal fermée", wrap(`<trk><trkseg>${validPoints}</trk></trkseg>`) ],
    ["imbrication incorrecte", wrap(`<trkseg><trk>${validPoints}</trk></trkseg>`) ],
    ["DOCTYPE", `<!DOCTYPE gpx>${wrap(track(validPoints))}`],
  ])("rejette une structure non prise en charge : %s", (_label, xml) => {
    expect(() => parseGpxTrack(xml)).toThrow(SyntaxError);
  });

  it("rejette séparément un CDATA dans ele", () => {
    const xml = wrap(track(`<trkpt lat="1" lon="2"><ele><![CDATA[3]]></ele></trkpt>${point("4", "5", "6")}`));
    expect(() => parseGpxTrack(xml)).toThrow(SyntaxError);
  });
});
