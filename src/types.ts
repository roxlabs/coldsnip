export interface Snippet {
  language: string;
  sourcePath: string;
  startLine: number;
  endLine: number;
  content: string;
  permalink?: string;
  qualifier?: string;
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
  commit?: string;
}

export type SourcePath = LocalPath | GitRepo;

export type GitRepoInfo = Omit<GitRepo, "pattern">;

export interface SourceRef {
  directory: string;
  repoUrl?: string;
  commit?: string;
}

export interface GitFileRef {
  repoUrl: string;
  path: string;
  commit: string;
  startLine: number;
  endLine: number;
}

export interface GitRepoRef {
  workingDir: string;
  commit: string;
}

export type Snippets = { [key: string]: Snippet[] };
