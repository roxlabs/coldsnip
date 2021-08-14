import extractSnippets from "./extractSnippets";

export type {
  SourcePath,
  GitRepo,
  LocalPath,
  Snippet,
  Snippets,
} from "./types";

export { default as cli } from "./cli";

export { extractSnippets };
