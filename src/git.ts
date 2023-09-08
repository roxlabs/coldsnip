import { exec } from "child_process";
import { rm, stat } from "fs/promises";
import * as os from "os";
import * as path from "path";
import { URL } from "url";
import { promisify } from "util";
import type { GitFileRef, GitRepoInfo, GitRepoRef } from "./types";

const execCommand = promisify(exec);

export function getRepoPath(url: string) {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname;
}

export async function ensureRepoIsCurrent(
  info: GitRepoInfo,
): Promise<GitRepoRef> {
  const repoPath = getRepoPath(info.url);
  const branch = info.branch ?? "main";
  const workingDir =
    info.workingDir ?? path.join(os.tmpdir(), ".coldsnip", repoPath, branch);

  await cloneAndCheckout(info.url, workingDir, branch);
  const commit = await getHeadCommitId();
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

async function cloneAndCheckout(
  repoUrl: string,
  destination: string,
  branch: string = "main",
): Promise<void> {
  const directoryExists = await isDirectory(destination);
  if (directoryExists) {
    await rm(destination, { recursive: true });
  }
  const command = `git clone --branch ${branch} --depth 1 ${repoUrl} ${destination}`;
  await execCommand(command);
}

async function getHeadCommitId(): Promise<string> {
  const command = `git rev-parse HEAD`;
  const { stdout } = await execCommand(command);
  return stdout.trim();
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}
