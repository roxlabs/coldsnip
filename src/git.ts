import { Clone, Repository } from "nodegit";
import * as os from "os";
import * as path from "path";
import { URL } from "url";
import type { GitFileRef, GitRepoInfo, GitRepoRef } from "./types";

export function getRepoPath(url: string) {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname;
}

export async function ensureRepoIsCurrent(
  info: GitRepoInfo
): Promise<GitRepoRef> {
  const repoPath = getRepoPath(info.url);
  const branch = info.branch ?? "main";
  const workingDir =
    info.workingDir ?? path.join(os.tmpdir(), ".snippetfy", repoPath, branch);

  let repo: Repository;
  try {
    repo = await Repository.open(workingDir);
    await repo.checkoutBranch(branch);
    if (info.pull) {
      await repo.fetch("origin");
      await repo.mergeBranches(branch, `refs/remotes/origin/${branch}`);
    }
  } catch (e) {
    repo = await Clone.clone(info.url, workingDir, {
      checkoutBranch: branch,
    });
  }
  const commit = (await repo.getHeadCommit()).id().toString();
  return {
    commit,
    workingDir,
  };
}

export function getPermalink(ref: GitFileRef): string {
  const url = new URL(ref.repoUrl);
  switch (url.hostname) {
    case "github.com":
      return `${ref.repoUrl}/blob/${ref.commit}/${ref.path}#L${ref.startLine}-L${ref.endLine}`;
    case "gitlab.com":
      return `${ref.repoUrl}/-/blob/${ref.commit}/${ref.path}#L${ref.startLine}-${ref.endLine}`;
    case "bitbucket.org":
      return `${ref.repoUrl}/src/${ref.commit}/${ref.path}#lines-${ref.startLine}:${ref.endLine}`;
    default:
      throw new Error(`Git provider not yet supported: ${ref.repoUrl}`);
  }
}
