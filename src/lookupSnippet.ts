import { Snippet, Snippets } from "./types";

/**
 * Snippet lookup options. The `key` is always required, the other properties
 * are useful for matching multi-language snippets indexed by the same key.
 */
export type LookupOptions = {
  /** the snippet identifier */
  key: string;
  /** the snippet source language */
  language?: string;
  /** the snippet qualifier. Often use to differentiate snippets */
  qualifier?: string;
};

/**
 * Lookup for a specific snippet.
 *
 * **Implementation note:** in case more than one snippet match the options
 * the first matched result will be returned.
 *
 * @param snippets all extracted snippets
 * @param options the lookup options
 * @returns the matching snippet or `undefined` in case it couldn't be found.
 */
function lookupSnippet(
  snippets: Snippets,
  options: LookupOptions,
): Snippet | undefined {
  const { key, language, qualifier } = options;
  const matchedSnippets = snippets[key];
  if (!matchedSnippets || matchedSnippets.length === 0) {
    return undefined;
  }
  return matchedSnippets.find((snippet) => {
    return (
      (typeof language === "undefined" || snippet.language === language) &&
      (typeof qualifier === "undefined" || snippet.qualifier === qualifier)
    );
  });
}

export default lookupSnippet;
