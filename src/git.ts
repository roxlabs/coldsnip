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

export async function getHeadCommitId(): Promise<string> {
  const command = `git rev-parse HEAD`;
  const { stdout } = await execCommand(command);
  return stdout.trim();
}

/**
 * Retrieves the URL of the 'origin' remote for a given Git repository.
 *
 * @param repoDir The directory where the Git repository is located.
 * @returns A promise that resolves with the URL, or rejects with an error.
 */
export async function getOriginRemoteURL(
  dir: string,
): Promise<string | undefined> {
  try {
    const command = "git config --get remote.origin.url";
    const { stdout } = await execCommand(command, { cwd: dir });
    return stdout.trim().replace(/\.git$/, "");
  } catch (error) {
    return undefined;
  }
}

/**
 * Checks whether Git is installed on the system.
 *
 * @returns A promise that resolves with a boolean indicating whether Git is installed.
 */
async function isGitAvailable(): Promise<boolean> {
  try {
    const { stdout } = await execCommand("git --version");
    return stdout.trim().startsWith("git version");
  } catch (error) {
    return false;
  }
}

export type GitInfo = {
  repoUrl?: string;
  commit?: string;
};

export async function getLocalRepoInfo(path: string): Promise<GitInfo> {
  const isAvailable = await isGitAvailable();
  if (!isAvailable) {
    return {};
  }
  const [repoUrl, commit] = await Promise.all([
    getOriginRemoteURL(path),
    getHeadCommitId(),
  ]);
  return { repoUrl, commit };
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (error) {
    return false;
  }
}
