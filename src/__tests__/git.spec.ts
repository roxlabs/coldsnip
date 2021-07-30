import { existsSync } from "fs";
import { ensureRepoIsCurrent, getRepoPath } from "../git";

describe("the Git repo test suite", () => {
  it("should get the repo name from the Git HTTPS URL", () => {
    const url = "https://github.com/roxlabs/snippetfy";
    expect(getRepoPath(url)).toBe("/roxlabs/snippetfy");
  });

  it("should ensure the main branch of the repo is cloned and up-to-date", async () => {
    const dir = await ensureRepoIsCurrent({
      url: "https://github.com/drochetti/drochetti"
    });
    expect(existsSync(dir)).toBe(true);
  });
});
