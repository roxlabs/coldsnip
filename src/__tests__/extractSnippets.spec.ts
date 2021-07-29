import extractSnippets from "../index";

describe("the extractSnippets public API test suite", () => {
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
});
