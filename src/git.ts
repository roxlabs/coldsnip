import { Clone, Repository } from "nodegit";
import * as os from "os";
import * as path from "path";
import { URL } from "url";
import type { GitRepoInfo } from "./types";

export function getRepoPath(url: string) {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname;
}

export async function ensureRepoIsCurrent(info: GitRepoInfo): Promise<string> {
  const repoPath = getRepoPath(info.url);
  const workingDir =
    info.workingDir ?? path.join(os.tmpdir(), ".snippetfy", repoPath);
  const branch = info.branch ?? "main";
  let repo: Repository;
  try {
    repo = await Repository.open(workingDir);
    await repo.checkoutBranch(info.branch ?? branch);
    await repo.fetch("origin");
    await repo.mergeBranches(branch, `refs/remotes/origin/${branch}`);
  } catch (e) {
    console.info(
      `Git repo ${info.url} is not cloned yet... cloning it to ${workingDir}`
    );
    repo = await Clone.clone(info.url, workingDir, {
      checkoutBranch: branch,
    });
  }
  console.log((await repo.getHeadCommit()).id().toString());
  return workingDir;
}
