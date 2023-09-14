import { extname as getExtension, relative as getRelativePath } from "path";
import { getPermalink } from "./git";
import { normalizeIndent } from "./indent";
import type { Snippet } from "./types";

type SnippetInput = {
  content: string;
  directory: string;
  filePath: string;
  startLine: number;
  endLine: number;
  qualifier?: string;
  commit?: string;
  repoUrl?: string;
};
export default function createSnippet(input: SnippetInput): Snippet {
  const {
    content,
    directory,
    filePath,
    startLine,
    endLine,
    repoUrl,
    commit,
    qualifier,
  } = input;
  const sourcePath = getRelativePath(directory, filePath);
  const permalink =
    repoUrl !== undefined && commit !== undefined
      ? getPermalink({
          repoUrl,
          commit,
          startLine: startLine as number,
          endLine,
          path: sourcePath,
        })
      : undefined;
  return {
    language: getExtension(input.filePath).slice(1),
    sourcePath,
    filename: filePath.split("/").pop() as string,
    content: normalizeIndent(content).trim(),
    startLine: startLine as number,
    endLine,
    permalink,
    qualifier,
  };
}
