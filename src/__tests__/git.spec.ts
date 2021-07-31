import { existsSync } from "fs";
import { ensureRepoIsCurrent, getPermalink, getRepoPath } from "../git";

describe("the Git repo test suite", () => {
  it("should get the repo name from the Git HTTPS URL", () => {
    const url = "https://github.com/roxlabs/snippetfy";
    expect(getRepoPath(url)).toBe("/roxlabs/snippetfy");
  });

  it("should ensure the main branch of the repo is cloned and up-to-date", async () => {
    const dir = await ensureRepoIsCurrent({
      url: "https://github.com/drochetti/drochetti",
    });
    expect(existsSync(dir)).toBe(true);
  });

  it("should resolve the permalink for GitHub repos", () => {
    const permalink = getPermalink({
      repoUrl: "https://github.com/roxlabs/snippetfy",
      commit: "d16f69f4eb4f46855c66420c02c586138fb38fcf",
      path: "src/index.ts",
      startLine: 1,
      endLine: 3,
    });
    expect(permalink).toBe(
      "https://github.com/roxlabs/snippetfy/blob/d16f69f4eb4f46855c66420c02c586138fb38fcf/src/index.ts#L1-L3"
    );
  });

  it("should resolve the permalink for GitLab repos", () => {
    const permalink = getPermalink({
      repoUrl: "https://gitlab.com/gitlab-org/gitlab",
      commit: "12ecbd8580e13bd385729772102f86bcecfda04f",
      path: "package.json",
      startLine: 4,
      endLine: 9,
    });
    expect(permalink).toBe(
      "https://gitlab.com/gitlab-org/gitlab/-/blob/12ecbd8580e13bd385729772102f86bcecfda04f/package.json#L4-9"
    );
  });

  it("should resolve the permalink for BitBucket repos", () => {
    const permalink = getPermalink({
      repoUrl: "https://bitbucket.org/atlassian/npm-publish",
      commit: "81c90f7e6b1c0859652bf6bd0dc478d99c37d6ac",
      path: "test/test.py",
      startLine: 22,
      endLine: 27,
    });
    expect(permalink).toBe(
      "https://bitbucket.org/atlassian/npm-publish/src/81c90f7e6b1c0859652bf6bd0dc478d99c37d6ac/test/test.py#lines-22:27"
    );
  });
});
