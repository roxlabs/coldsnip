import { Snippets } from "../types";

export type OutputFormat = "json" | "markdown";

export type SnippetTransformer = (snippets: Snippets) => Promise<void>;
