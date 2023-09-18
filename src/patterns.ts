export const COMMENT_TOKEN = /(\/\/|\/\*|#|--|\(\*|<!--|{-|')/;
export const TAG_TOKEN = /@(snippet|highlight)/;

export const START = new RegExp(
  `${COMMENT_TOKEN.source}\\s*(?:${TAG_TOKEN.source}):(?:start)\\s*(?:\\(([\\S ]+)\\))?`,
);
const START_TAG_GROUP = 2;
const START_ARG_GROUP = 3;

export const END = new RegExp(
  `${COMMENT_TOKEN.source}\\s*(?:${TAG_TOKEN.source}):(end)`,
);

type Tag = {
  name: "snippet" | "highlight";
};

export type OpenTag = Tag & {
  args?: TagArgs;
};

export type CloseTag = Tag & {};

/**
 * Parse a value string to its appropriate type.
 * @param {string} value The string to parse.
 * @returns {string | number | boolean} The parsed value.
 * @throws {Error} Throws an error if the value cannot be parsed.
 */
export function parseValue(value: string): string | number | boolean {
  if (value === "true") return true;
  if (value === "false") return false;

  const numValue = parseFloat(value);
  if (!isNaN(numValue)) return numValue;

  const match = value.match(/^"(.+)"$/);
  if (match) return match[1];

  throw new Error(`Invalid argument value: ${value}`);
}

type TagArgs = { [key: string]: string | number | boolean };

/**
 * Parse the arguments string into an object.
 * @param {string} args The arguments string.
 * @returns {Object} The parsed arguments.
 */
function parseArguments(args: string): TagArgs {
  const argsArray = args.split(",");
  let firstArg = argsArray[0].trim();

  // Special case: Check for a first positional argument as the "id"
  let initialArgs = {};
  if (!firstArg.includes(":")) {
    const idValue = parseValue(firstArg);
    if (typeof idValue !== "string") {
      throw new Error(
        `The first positional argument 'id' must be a string, got: ${typeof idValue}`,
      );
    }
    argsArray.shift();
    initialArgs = { id: idValue };
  }

  // Standard case: key-value pairs
  return argsArray
    .map((arg) => arg.split(":").map((s) => s.trim()))
    .reduce((acc, [key, value]) => {
      return { ...acc, [key]: parseValue(value) };
    }, initialArgs);
}

export function matchesStartTag(value: string): OpenTag | undefined {
  const match = START.exec(value);
  if (match && match[START_TAG_GROUP]) {
    const name = match[START_TAG_GROUP];
    const argsStr = match[START_ARG_GROUP];
    let args;
    if (argsStr) {
      args = parseArguments(argsStr);
    }
    return {
      name: name as OpenTag["name"],
      args,
    };
  }
  return undefined;
}

export function matchesEndTag(value: string): CloseTag | undefined {
  const match = END.exec(value);
  if (match && match[START_TAG_GROUP]) {
    const name = match[START_TAG_GROUP];
    return { name: name as CloseTag["name"] };
  }
  return undefined;
}

// For highlight specific functions, you can either keep them or integrate them into the generalized functions
// depending on your specific needs.

const HIGHLIGHT_LINE = new RegExp(
  `(.*)\\s*${COMMENT_TOKEN.source}\\s*@highlight\\s*$`,
);

export function highlightedLine(line: string): string | undefined {
  const match = HIGHLIGHT_LINE.exec(line);
  if (match) {
    return match[1];
  }
  return undefined;
}

type SnippetStartTag = OpenTag & {
  args: {
    id: string;
    qualifier?: string;
  };
};

export function isSnippetStartTag(
  tag: OpenTag | undefined,
): tag is SnippetStartTag {
  return (
    tag !== undefined &&
    tag.name === "snippet" &&
    typeof tag.args?.id === "string"
  );
}
