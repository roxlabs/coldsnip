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
  branch?: string;
  repoUrl?: string;
  highlightedLines?: number[];
};
export default function createSnippet(input: SnippetInput): Snippet {
  const {
    content,
    directory,
    filePath,
    startLine,
    endLine,
    repoUrl,
    branch,
    qualifier,
    highlightedLines = [],
  } = input;
  const sourcePath = getRelativePath(directory, filePath);
  const permalink =
    repoUrl !== undefined && branch !== undefined
      ? getPermalink({
          repoUrl,
          branch,
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
    highlightedLines,
  };
}
