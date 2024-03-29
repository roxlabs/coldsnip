import extractSnippets from "./extractSnippets";
import lookupSnippets from "./lookupSnippet";

export type { LookupOptions } from "./lookupSnippet";
export type {
  ExtractSnippetOptions,
  GitRepo,
  LocalPath,
  Snippet,
  Snippets,
  SourcePath,
} from "./types";
export { extractSnippets, lookupSnippets };
