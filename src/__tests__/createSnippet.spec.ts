import createSnippet from "../createSnippet";

describe("the createSnippet test suite", () => {
  it("should create a snippet without a permalink", () => {
    const snippet = createSnippet({
      filePath: "src/index.ts",
      directory: "./",
      startLine: 1,
      endLine: 2,
      content: "content",
    });
    expect(snippet.permalink).toBeUndefined();
  });

  it("should create a snippet with a permalink", () => {
    const snippet = createSnippet({
      filePath: "src/index.ts",
      repoUrl: "https://github.com/roxlabs/snippetfy",
      commit: "d16f69f4eb4f46855c66420c02c586138fb38fcf",
      directory: "./",
      startLine: 1,
      endLine: 2,
      content: "content",
    });
    expect(snippet.permalink).toBeDefined();
  });
});
