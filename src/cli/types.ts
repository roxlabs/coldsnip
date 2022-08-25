import { Snippets, SourcePath } from "../types";

export type OutputFormat = "json" | "markdown" | "include";

export type SnippetTransformer = (snippets: Snippets) => Promise<void>;

export interface Config {
  paths?: SourcePath | SourcePath[];
}
