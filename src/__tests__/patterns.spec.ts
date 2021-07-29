import { matchesEndTag, parseStartTag } from "../patterns";

describe("the pattern matching test suite", () => {
  it("should match the start tag with a key", () => {
    const comment = "// @snippet:start(sample)";
    const tag = parseStartTag(comment);
    expect(tag).toBeDefined();
    expect(tag.key).toBe("sample");
    expect(tag.qualifier).toBeUndefined();
  });

  it("should match the start tag with a key and a qualifier", () => {
    const comment = "// @snippet:start(sample, promises)";
    const tag = parseStartTag(comment);
    expect(tag).toBeDefined();
    expect(tag.key).toBe("sample");
    expect(tag.qualifier).toBe("promises");
  });

  it("should match the start tag with a key wrapped in a HTML comment", () => {
    const comment = "<!-- @snippet:start(sample) -->";
    const tag = parseStartTag(comment);
    expect(tag).toBeDefined();
    expect(tag.key).toBe("sample");
  });

  it("should not match the start tag without a key", () => {
    const comment = "// @snippet:start";
    const tag = parseStartTag(comment);
    expect(tag).toBeUndefined();
  });

  it("should not match the start tag without a key (empty parenthesis)", () => {
    const comment = "// @snippet:start()";
    const tag = parseStartTag(comment);
    expect(tag).toBeUndefined();
  });

  it("should match the end tag", () => {
    // SQL style comments
    const comment = "-- @snippet:end";
    expect(matchesEndTag(comment)).toBe(true);
  });
});
