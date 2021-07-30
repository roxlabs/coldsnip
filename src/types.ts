export interface Snippet {
  language: string;
  sourcePath: string;
  startLine: number;
  endLine: number;
  content: string;
  permalink?: string;
}

export interface LocalPath {
  path: string;
  pattern: string;
}

export interface GitRepo {
  url: string;
  pattern: string;
  branch?: string;
  workingDir?: string;
}

export type GitRepoInfo = Omit<GitRepo, "pattern">;

export type Snippets = { [key: string]: Snippet[] };
