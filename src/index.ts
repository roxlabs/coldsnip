import extractSnippets from "./extractSnippets";
import lookupSnippets from "./lookupSnippet";

export type {
  SourcePath,
  GitRepo,
  LocalPath,
  Snippet,
  Snippets,
} from "./types";

export type { LookupOptions } from "./lookupSnippet";

export { default as cli } from "./cli";

export { extractSnippets, lookupSnippets };
