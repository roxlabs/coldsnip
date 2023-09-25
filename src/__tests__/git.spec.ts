import { existsSync, rmSync as removePath } from "fs";
import { tmpdir } from "os";
import { resolve as resolvePath } from "path";
import {
  ensureRepoIsCurrent,
  getLocalRepoInfo,
  getPermalink,
  getRepoPath,
} from "../git";

describe("the Git repo test suite", () => {
  const workingDir = resolvePath(tmpdir(), "coldsnip-git-test");

  it("should get the repo name from the Git HTTPS URL", () => {
    const url = "https://github.com/roxlabs/coldsnip";
    expect(getRepoPath(url)).toBe("/roxlabs/coldsnip");
  });

  it("should ensure the main branch of the repo is newly cloned", async () => {
    if (existsSync(workingDir)) {
      removePath(workingDir, { recursive: true });
    }
    const ref = await ensureRepoIsCurrent({
      url: "https://github.com/drochetti/drochetti",
      workingDir,
    });
    expect(existsSync(ref.workingDir)).toBe(true);
  });

  it("should ensure the main branch of the repo is cloned and up-to-date", async () => {
    const dir = await ensureRepoIsCurrent({
      url: "https://github.com/drochetti/drochetti",
      workingDir,
    });
    expect(existsSync(dir.workingDir)).toBe(true);
  });

  it("should resolve the permalink for GitHub repos", () => {
    const permalink = getPermalink({
      repoUrl: "https://github.com/roxlabs/coldsnip",
      branch: "main",
      path: "src/index.ts",
      startLine: 1,
      endLine: 3,
    });
    expect(permalink).toBe(
      "https://github.com/roxlabs/coldsnip/blob/main/src/index.ts#L1-L3",
    );
  });

  it("should resolve the permalink for GitLab repos", () => {
    const permalink = getPermalink({
      repoUrl: "https://gitlab.com/gitlab-org/gitlab",
      branch: "develop",
      path: "package.json",
      startLine: 4,
      endLine: 9,
    });
    expect(permalink).toBe(
      "https://gitlab.com/gitlab-org/gitlab/-/blob/develop/package.json#L4-9",
    );
  });

  it("should resolve the permalink for BitBucket repos", () => {
    const permalink = getPermalink({
      repoUrl: "https://bitbucket.org/atlassian/npm-publish",
      branch: "staging",
      path: "test/test.py",
      startLine: 22,
      endLine: 27,
    });
    expect(permalink).toBe(
      "https://bitbucket.org/atlassian/npm-publish/src/staging/test/test.py#lines-22:27",
    );
  });

  it("should throw an error on unsupported Git providers", () => {
    expect(() => {
      getPermalink({
        repoUrl: "https://unsupported.provider.com/cool/repo",
        branch: "main",
        path: "README.md",
        startLine: 1,
        endLine: 2,
      });
    }).toThrow(/provider not yet supported/);
  });

  it("should get the repo url and head commit correctly", async () => {
    const { repoUrl, commit } = await getLocalRepoInfo(".");
    expect(repoUrl).toBe("https://github.com/roxlabs/coldsnip");
    expect(commit).toBeDefined();
  });
});
