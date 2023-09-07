import extractSnippets from "./extractSnippets";
import lookupSnippets from "./lookupSnippet";

export { default as cli } from "./cli";
export type { LookupOptions } from "./lookupSnippet";
export type {
  GitRepo,
  LocalPath,
  Snippet,
  Snippets,
  SourcePath,
} from "./types";
export { extractSnippets, lookupSnippets };
