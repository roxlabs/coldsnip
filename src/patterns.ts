export const COMMENT_TOKEN = /(\/\/|\/\*|#|--|\(\*|<!--|{-|')/;
export const TAG_TOKEN = /@snippet/;

export const START = new RegExp(
  `${COMMENT_TOKEN.source}\\s*(?:${TAG_TOKEN.source}:start)\\(([\\S ]+)\\)`
);
const START_KEY_GROUP = 2;
export const END = new RegExp(
  `${COMMENT_TOKEN.source}\\s*(?:${TAG_TOKEN.source}:end)`
);

export type OpenTag = {
  key: string;
  qualifier?: string;
};
export function parseStartTag(value: string): OpenTag | undefined {
  const match = START.exec(value);
  if (match && match[START_KEY_GROUP]) {
    const [key, qualifier] = match[START_KEY_GROUP].split(",");
    return {
      key: key.trim(),
      qualifier: qualifier?.trim(),
    };
  }
  return undefined;
}

export function matchesEndTag(value: string): boolean {
  return END.test(value);
}
