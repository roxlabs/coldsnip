/**
 * Represents a code snippet extracted from a source file. The field
 * `permalink` is only present when the source is from a Git repository.
 */
export interface Snippet {
  /** The source language. It matches the file extension. */
  language: string;
  /** The file path relative to the working directory. */
  sourcePath: string;
  /** The start line of the snippet. */
  startLine: number;
  /** The end line of the snippet. */
  endLine: number;
  /** The snippet content. Leading spaces are trimmed. */
  content: string;
  /** The link to the file on the remote Git repo when available. */
  permalink?: string;
  /**
   * An extra qualifier that can be used to differentiate snippets with the same key
   * that might come from the same file extension.
   */
  qualifier?: string;
}

/**
 * A map between a `key` and a collection of {@link Snippet} represented by it.
 * Different snippets can be identified by the same key, which is the case in projects
 * with support to multiple languages that want to provide samples of the same API in
 * each supported language.
 */
export type Snippets = { [key: string]: Snippet[] };

/**
 * Represents a local directory and a matching pattern/glob for files.
 * @see GitRepo
 */
export interface LocalPath {
  /** The relative or absolute path. */
  path: string;
  /** The file pattern / glob to match. */
  pattern: string;
}

/**
 * Represents a Git repository and a matching pattern/glob for files.
 * @see LocalPath
 */
export interface GitRepo {
  /** The remote Git repository URL. */
  url: string;
  /** The file pattern / glob to match. */
  pattern: string;
  /**
   * Should pull the latest changes? (merge from origin)
   * @default false
   */
  pull?: boolean;
  /**
   * An optional branch name.
   * @default "main"
   */
  branch?: string;
  /**
   * The directory where the repo should be cloned to.
   * @default "$TMP/$repoName/$branch"
   */
  workingDir?: string;
}

/**
 * A union between {@link LocalPath} and {@link GitRepo} and serves as the main
 * entry point of the library.
 */
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
