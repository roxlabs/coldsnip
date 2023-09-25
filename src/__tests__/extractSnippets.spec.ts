import { basename } from "path";
import extractSnippets, { findFiles } from "../extractSnippets";

describe("the extractSnippets public API test suite", () => {
  it("should find the files from all sources", async () => {
    const result = await findFiles(
      [
        { path: "./", pattern: "src/__tests__/snippets/*.js" },
        { url: "https://github.com/drochetti/drochetti", pattern: "*.md" },
      ],
      { branch: "main" },
    );
    const paths: string[] = [];
    result.forEach(([files, source]) => {
      paths.push(...files);
    });
    const filenames = paths.map((path) => basename(path));
    expect(filenames.length).toBe(3);
    expect(filenames).toEqual(["missingKey.js", "twoSnippets.js", "README.md"]);
  });

  it("should extract two snippets", async () => {
    // @snippet:start("readme.lib")
    const snippets = await extractSnippets([
      { path: "src/__tests__", pattern: "snippets/twoSnippets.js" },
    ]);
    // @snippet:end
    const keys = Object.keys(snippets);
    expect(keys.length).toBe(2);
    expect(keys[0]).toBe("first");
    expect(keys[1]).toBe("second");
  });

  it("should extract two snippets and the second should have a qualifier", async () => {
    const snippets = await extractSnippets([
      { path: "src/__tests__", pattern: "snippets/twoSnippets.js" },
    ]);
    expect(snippets["second"][0].qualifier).toBe("force");
  });

  it("should contain no snippet since the start tag is missing the key", async () => {
    const snippets = await extractSnippets([
      { path: "src/__tests__", pattern: "snippets/missingKey.js" },
    ]);
    expect(Object.keys(snippets).length).toBe(0);
  });

  it("should extract a snippet from a SQL file", async () => {
    const snippets = await extractSnippets([
      { path: "src/__tests__", pattern: "snippets/query.sql" },
    ]);
    const keys = Object.keys(snippets);
    expect(keys.length).toBe(1);
    expect(keys[0]).toBe("query");
  });

  it("should extract a snippet with the same key from multiple files", async () => {
    const snippets = await extractSnippets([
      { path: "src/__tests__", pattern: "snippets/multi.*" },
    ]);
    const keys = Object.keys(snippets);
    expect(keys.length).toBe(1);
    expect(keys[0]).toBe("multi");
    const all = snippets["multi"] || [];
    expect(all.length).toBe(4);
    expect(all.find((snippet) => snippet.language === "rb")?.content).toBe(
      'puts "hello, world"',
    );
  });

  it("should extract a snippet with indentation and strip the extra spaces", async () => {
    const snippets = await extractSnippets([
      { path: "src/__tests__", pattern: "snippets/indentedContent.html" },
    ]);
    const all = snippets["indent"] || [];
    expect(all.length).toBe(1);
    expect(all.find((snippet) => snippet.language === "html")?.content).toBe(
      "<div>\n  <span>Indented content should be stripped</span>\n</div>",
    );
  });

  it("should extract a snippet with a highlighted line", async () => {
    const snippets = await extractSnippets([
      { path: "src/__tests__", pattern: "snippets/highlights.ts" },
    ]);
    const snippet = snippets["highlight.singleline"][0];
    expect(snippet).toBeDefined();
    expect(snippet.highlightedLines).toEqual([2]);
  });

  it("should extract a snippet with a highlighted multiline", async () => {
    const snippets = await extractSnippets([
      { path: "src/__tests__", pattern: "snippets/highlights.ts" },
    ]);
    const snippet = snippets["highlight.multiline"][0];
    expect(snippet).toBeDefined();
    expect(snippet.highlightedLines).toEqual([2, 3]);
  });

  it("should extract a snippet with multiple highlighted lines", async () => {
    const snippets = await extractSnippets([
      { path: "src/__tests__", pattern: "snippets/highlights.ts" },
    ]);
    const snippet = snippets["highlight.multiple"][0];
    expect(snippet).toBeDefined();
    expect(snippet.highlightedLines).toEqual([2, 3, 7]);
  });

  // TODO: why does this test timeout when a glob finds no files? Investigate it...
  xit("should return an empty object if no files are found", async () => {
    const snippets = await extractSnippets([
      { path: "src/__tests__", pattern: "snippets/missing.*" },
    ]);
    expect(snippets).toEqual({});
  });
});
