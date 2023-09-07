import { Snippets } from "../types";
import IncludeRenderer from "./include";
import JsonRenderer from "./json";
import MarkdownRenderer from "./markdown";
import { Renderer } from "./types";

type RendererKey = "json" | "markdown" | "include";
type RendererType = new (args: any) => Renderer;

const renderers: Record<RendererKey, RendererType> = {
  include: IncludeRenderer,
  json: JsonRenderer,
  markdown: MarkdownRenderer,
};

export async function render(
  snippets: Snippets,
  format: RendererKey,
  options: any,
) {
  const Renderer = renderers[format];
  const renderer = new Renderer(options);
  await renderer.render(snippets);
}
