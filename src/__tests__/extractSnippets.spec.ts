import { basename } from "path";
import extractSnippets, { findFiles } from "../extractSnippets";

describe("the extractSnippets public API test suite", () => {
  it("should find the files from all sources", async () => {
    const result = await findFiles([
      { path: "./", pattern: "src/__tests__/snippets/*.js" },
      { url: "https://github.com/drochetti/drochetti", pattern: "*.md" },
    ]);
    const paths: string[] = [];
    result.forEach(([files, source]) => {
      paths.push(...files);
    });
    const filenames = paths.map((path) => basename(path));
    expect(filenames.length).toBe(3);
    expect(filenames).toEqual(["missingKey.js", "twoSnippets.js", "README.md"]);
  });

  it("it should extract two snippets", async () => {
    const snippets = await extractSnippets([
      {
        path: "src/__tests__",
        pattern: "snippets/twoSnippets.js",
      },
    ]);
    const keys = Object.keys(snippets);
    expect(keys.length).toBe(2);
    expect(keys[0]).toBe("first");
    expect(keys[1]).toBe("second");
  });

  it("it should extract two snippets and the second should have a qualifier", async () => {
    const snippets = await extractSnippets([
      {
        path: "src/__tests__",
        pattern: "snippets/twoSnippets.js",
      },
    ]);
    expect(snippets["second"][0].qualifier).toBe("qualifier");
  });

  it("it should contain no snippet since the start tag is missing the key", async () => {
    const snippets = await extractSnippets([
      {
        path: "src/__tests__",
        pattern: "snippets/missingKey.js",
      },
    ]);
    expect(Object.keys(snippets).length).toBe(0);
  });

  it("it should extract a snippet from a SQL file", async () => {
    const snippets = await extractSnippets([
      {
        path: "src/__tests__",
        pattern: "snippets/query.sql",
      },
    ]);
    const keys = Object.keys(snippets);
    expect(keys.length).toBe(1);
    expect(keys[0]).toBe("query");
  });

  it("it should extract a snippet with the same key from multiple files", async () => {
    const snippets = await extractSnippets([
      {
        path: "src/__tests__",
        pattern: "snippets/multi.*",
      },
    ]);
    const keys = Object.keys(snippets);
    expect(keys.length).toBe(1);
    expect(keys[0]).toBe("multi");
    const all = snippets["multi"];
    expect(all.length).toBe(4);
    expect(all.find((snippet) => snippet.language === "rb").content).toBe(
      'puts "hello, world"'
    );
  });
});
