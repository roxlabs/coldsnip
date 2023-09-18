import {
  isSnippetStartTag,
  matchesEndTag,
  matchesStartTag,
  parseValue,
} from "../patterns";

describe("the pattern matching test suite", () => {
  it("should match the start tag with a key", () => {
    const comment = `// @snippet:start("sample")`;
    const tag = matchesStartTag(comment);
    expect(tag).toBeDefined();
    expect(tag?.args?.id).toBe("sample");
    expect(tag?.args?.qualifier).toBeUndefined();
  });

  it("should match the start tag with a key and a qualifier", () => {
    const comment = `// @snippet:start("sample", qualifier: "promises")`;
    const tag = matchesStartTag(comment);
    expect(tag).toBeDefined();
    expect(isSnippetStartTag(tag)).toBe(true);
    expect(tag?.args?.id).toBe("sample");
    expect(tag?.args?.qualifier).toBe("promises");
  });

  it("should match the start tag with a key wrapped in a HTML comment", () => {
    const comment = `<!-- @snippet:start("sample") -->`;
    const tag = matchesStartTag(comment);
    expect(tag).toBeDefined();
    expect(tag?.args?.id).toBe("sample");
  });

  it("should not match the start tag without a key", () => {
    const comment = "// @snippet:start";
    const tag = matchesStartTag(comment);
    expect(isSnippetStartTag(tag)).toBe(false);
  });

  it("should not match the start tag without a key (empty parenthesis)", () => {
    const comment = "// @snippet:start()";
    const tag = matchesStartTag(comment);
    expect(isSnippetStartTag(tag)).toBe(false);
  });

  it("should match the snippet end tag", () => {
    // SQL style comments
    const comment = "-- @snippet:end";
    expect(matchesEndTag(comment)).toEqual({ name: "snippet", indent: "" });
  });

  it("should match the highlight end tag", () => {
    // Python style comments
    const comment = "  # @highlight:end";
    expect(matchesEndTag(comment)).toEqual({ name: "highlight", indent: "  " });
  });

  it("should parse values correctly", () => {
    expect(parseValue("true")).toBe(true);
    expect(parseValue("false")).toBe(false);
    expect(parseValue("1")).toBe(1);
    expect(parseValue("1.2")).toBe(1.2);
    expect(parseValue(`"hello"`)).toBe("hello");
    expect(() => parseValue("value")).toThrowError();
  });
});
