/** Point brut d'un segment GPX, avant toute projection ou conversion de parcours. */
export interface RawGpxTrackPoint {
  readonly latitudeDegrees: number;
  readonly longitudeDegrees: number;
  readonly altitudeMeters: number;
}

/** Segment de trace GPX analysé et profondément immuable. */
export interface ParsedGpxTrack {
  readonly points: readonly Readonly<RawGpxTrackPoint>[];
}

interface ElementFrame {
  readonly qualifiedName: string;
  readonly localName: string;
  readonly kind: "other" | "gpx" | "trk" | "trkseg" | "trkpt" | "ele";
  text: string;
  latitudeText?: string;
  longitudeText?: string;
  altitudeText?: string;
  elevationCount: number;
}

const XML_NAME_START = /[A-Za-z_]/;
const XML_NAME_PART = /[A-Za-z0-9_.:-]/;
const DECIMAL_NUMBER = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

function localName(qualifiedName: string): string {
  const colon = qualifiedName.lastIndexOf(":");
  return colon < 0 ? qualifiedName : qualifiedName.slice(colon + 1);
}

function parseNumber(text: string, field: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0 || trimmed.includes("&") || !DECIMAL_NUMBER.test(trimmed)) {
    throw new SyntaxError(`${field} must be a decimal number without XML entities`);
  }
  const value = Number(trimmed);
  if (!Number.isFinite(value)) throw new SyntaxError(`${field} must be finite`);
  return value;
}

function assertWellFormedEntities(text: string, context: string): void {
  for (let index = text.indexOf("&"); index >= 0; index = text.indexOf("&", index + 1)) {
    const tail = text.slice(index);
    const entity = tail.match(/^&(amp|lt|gt|apos|quot|#\d+|#x[0-9A-Fa-f]+);/);
    if (entity === null) throw new SyntaxError(`XML entity in ${context} is malformed or unsupported`);
    index += entity[0].length - 1;
  }
}

function classifyElement(name: string, parent: ElementFrame | undefined): ElementFrame["kind"] {
  const local = localName(name);
  if (parent === undefined && local === "gpx") return "gpx";
  if (parent?.kind === "gpx" && local === "trk") return "trk";
  if (parent?.kind === "trk" && local === "trkseg") return "trkseg";
  if (parent?.kind === "trkseg" && local === "trkpt") return "trkpt";
  if (parent?.kind === "trkpt" && local === "ele") return "ele";
  return "other";
}

/**
 * Analyse le sous-ensemble GPX 1.1 à une trace et un segment, sans DOM ni navigateur.
 */
export function parseGpxTrack(xml: string): ParsedGpxTrack {
  const stack: ElementFrame[] = [];
  const points: RawGpxTrackPoint[] = [];
  let cursor = 0;
  let rootCount = 0;
  let trackCount = 0;
  let segmentCount = 0;

  const syntax = (message: string): never => { throw new SyntaxError(message); };
  const skipWhitespace = (): void => {
    while (cursor < xml.length && /\s/.test(xml[cursor] ?? "")) cursor += 1;
  };
  const readName = (): string => {
    const start = cursor;
    if (!XML_NAME_START.test(xml[cursor] ?? "")) syntax("XML element or attribute name is invalid");
    cursor += 1;
    while (cursor < xml.length && XML_NAME_PART.test(xml[cursor] ?? "")) cursor += 1;
    const name = xml.slice(start, cursor);
    if (name.endsWith(":") || name.includes("::")) syntax("XML qualified name is invalid");
    return name;
  };

  const closeFrame = (closingName: string): void => {
    const frame = stack.pop();
    if (frame === undefined || frame.qualifiedName !== closingName) {
      throw new SyntaxError(`XML closing tag ${closingName} is incorrectly nested`);
    }
    if (frame.kind === "ele") {
      const parent = stack[stack.length - 1];
      if (parent === undefined || parent.kind !== "trkpt") {
        throw new SyntaxError("ele must belong to a trkpt");
      }
      parent.elevationCount += 1;
      if (parent.elevationCount > 1) syntax("trkpt must contain exactly one ele");
      parent.altitudeText = frame.text;
    } else if (frame.kind === "trkpt") {
      if (frame.latitudeText === undefined) syntax("trkpt latitude is missing");
      if (frame.longitudeText === undefined) syntax("trkpt longitude is missing");
      if (frame.elevationCount !== 1 || frame.altitudeText === undefined) {
        syntax("trkpt must contain exactly one ele");
      }
      const latitudeDegrees = parseNumber(frame.latitudeText ?? "", "trkpt latitude");
      const longitudeDegrees = parseNumber(frame.longitudeText ?? "", "trkpt longitude");
      const altitudeMeters = parseNumber(frame.altitudeText ?? "", "trkpt elevation");
      if (latitudeDegrees < -90 || latitudeDegrees > 90) {
        throw new RangeError("trkpt latitude must be between -90 and 90 degrees");
      }
      if (longitudeDegrees < -180 || longitudeDegrees > 180) {
        throw new RangeError("trkpt longitude must be between -180 and 180 degrees");
      }
      points.push(Object.freeze({ latitudeDegrees, longitudeDegrees, altitudeMeters }));
    }
  };

  while (cursor < xml.length) {
    if (xml[cursor] !== "<") {
      const start = cursor;
      while (cursor < xml.length && xml[cursor] !== "<") cursor += 1;
      const text = xml.slice(start, cursor);
      assertWellFormedEntities(text, "text");
      const frame = stack[stack.length - 1];
      if (frame === undefined) {
        if (text.trim() !== "") syntax("XML text is not allowed outside the root element");
      } else if (frame.kind === "ele") frame.text += text;
      continue;
    }

    if (xml.startsWith("<!--", cursor)) {
      const end = xml.indexOf("-->", cursor + 4);
      if (end < 0 || xml.slice(cursor + 4, end).includes("--")) syntax("XML comment is malformed");
      cursor = end + 3;
      continue;
    }
    if (xml.startsWith("<!DOCTYPE", cursor) || xml.startsWith("<!doctype", cursor)) {
      syntax("DOCTYPE is not supported");
    }
    if (xml.startsWith("<![CDATA[", cursor)) syntax("CDATA is not supported");
    if (xml.startsWith("<?", cursor)) {
      const end = xml.indexOf("?>", cursor + 2);
      if (end < 0) syntax("XML processing instruction is malformed");
      cursor = end + 2;
      continue;
    }
    if (xml.startsWith("</", cursor)) {
      cursor += 2;
      const name = readName();
      skipWhitespace();
      if (xml[cursor] !== ">") syntax("XML closing tag is malformed");
      cursor += 1;
      closeFrame(name);
      continue;
    }
    if (xml.startsWith("<!", cursor)) syntax("XML declaration is not supported");

    cursor += 1;
    const name = readName();
    const parent = stack[stack.length - 1];
    const kind = classifyElement(name, parent);
    if (parent?.kind === "ele") syntax("ele must contain only numeric text");
    const attributes = new Map<string, string>();
    let selfClosing = false;
    while (true) {
      skipWhitespace();
      if (xml.startsWith("/>", cursor)) { selfClosing = true; cursor += 2; break; }
      if (xml[cursor] === ">") { cursor += 1; break; }
      if (cursor >= xml.length) syntax("XML start tag is not closed");
      const attributeName = readName();
      if (attributes.has(attributeName)) syntax(`duplicate XML attribute ${attributeName}`);
      skipWhitespace();
      if (xml[cursor] !== "=") syntax(`XML attribute ${attributeName} has no value`);
      cursor += 1;
      skipWhitespace();
      const quote = xml[cursor];
      if (quote !== "\"" && quote !== "'") syntax(`XML attribute ${attributeName} is not quoted`);
      cursor += 1;
      const valueStart = cursor;
      while (cursor < xml.length && xml[cursor] !== quote) cursor += 1;
      if (cursor >= xml.length) syntax(`XML attribute ${attributeName} is not closed`);
      const attributeValue = xml.slice(valueStart, cursor);
      if (attributeValue.includes("<")) syntax(`XML attribute ${attributeName} contains an invalid character`);
      assertWellFormedEntities(attributeValue, `attribute ${attributeName}`);
      attributes.set(attributeName, attributeValue);
      cursor += 1;
    }

    if (parent === undefined) {
      rootCount += 1;
      if (rootCount > 1 || kind !== "gpx") syntax("GPX document must have one gpx root element");
      const versions = [...attributes].filter(([attribute]) => localName(attribute) === "version");
      if (versions.length !== 1 || versions[0]?.[1] !== "1.1") syntax("gpx version must be 1.1");
    }
    if (kind === "trk") { trackCount += 1; if (trackCount > 1) syntax("gpx must contain exactly one trk"); }
    if (kind === "trkseg") { segmentCount += 1; if (segmentCount > 1) syntax("trk must contain exactly one trkseg"); }

    const frame: ElementFrame = { qualifiedName: name, localName: localName(name), kind, text: "", elevationCount: 0 };
    if (kind === "trkpt") {
      for (const [attribute, value] of attributes) {
        const local = localName(attribute);
        if (local === "lat") {
          if (frame.latitudeText !== undefined) syntax("trkpt latitude attribute is duplicated");
          frame.latitudeText = value;
        } else if (local === "lon") {
          if (frame.longitudeText !== undefined) syntax("trkpt longitude attribute is duplicated");
          frame.longitudeText = value;
        }
      }
    }
    stack.push(frame);
    if (selfClosing) closeFrame(name);
  }

  if (stack.length !== 0) syntax(`XML element ${stack[stack.length - 1]?.localName ?? "unknown"} is not closed`);
  if (rootCount !== 1) syntax("GPX document must have one gpx root element");
  if (trackCount !== 1) syntax("gpx must contain exactly one trk");
  if (segmentCount !== 1) syntax("trk must contain exactly one trkseg");
  if (points.length < 2) syntax("trkseg must contain at least two trkpt elements");
  return Object.freeze({ points: Object.freeze(points) });
}
