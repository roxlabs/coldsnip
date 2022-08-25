import { asyncify, queue } from "async";
import glob from "fast-glob";
import { writeFile } from "fs/promises";
import process from "process";
import forEachLine from "../forEachLine";
import lookupSnippet from "../lookupSnippet";
import type { Snippets } from "../types";
import type { Renderer } from "./types";

type Options = {
  pattern: string | string[];
};

const DEFAULT_OPTIONS: Options = {
  pattern: "**/*.md",
};

const TAG_PATTERN = /^(\s*)<!---?\s*@snippet:include\((.*)\)\s*-?-->/;
const CODE_FENCE_PATTERN = /^(\s*)```/;
const CODE_FENCE = "```";

type IncludeTag = {
  key: string;
  language?: string;
  qualifier?: string;
};

type FileRenderStep = "content" | "tag" | "codeblock";

function parseIncludeTag(value: string): IncludeTag {
  const [key, language, qualifier] = value
    .split(",")
    .map((item) => item.trim());
  if (!key || key.length === 0) {
    throw Error("");
  }
  return { key, language, qualifier };
}

type ParseInput = {
  file: string;
  snippets: Snippets;
};

async function parseFile(input: ParseInput) {
  const { file, snippets } = input;
  const content: string[] = [];
  let step: FileRenderStep = "content";
  let shouldRewrite: boolean = false;

  await forEachLine(file, (line) => {
    const { lineContent } = line;

    const includeTagMatch = TAG_PATTERN.exec(lineContent);
    const codeFenceMatch = CODE_FENCE_PATTERN.exec(lineContent);

    switch (step) {
      case "content":
        content.push(lineContent);
        if (includeTagMatch) {
          shouldRewrite = true;
          const [, indent, args] = includeTagMatch;
          const tag = parseIncludeTag(args);
          step = "tag";

          const snippet = lookupSnippet(snippets, tag);
          if (snippet) {
            content.push(indent + CODE_FENCE + snippet.language);
            content.push(
              ...snippet.content.split("\n").map((value) => indent + value)
            );
            content.push(indent + CODE_FENCE);
          } else {
            console.warn(`Snippet with key "${tag.key}" not found`);
          }
        }
        break;
      case "tag":
        step = codeFenceMatch ? "codeblock" : "content";
        break;
      case "codeblock":
        step = codeFenceMatch ? "content" : "codeblock";
        break;
    }
  });

  if (shouldRewrite) {
    await writeFile(file, content.join("\n"), { encoding: "utf-8" });
  }
}

export default class IncludeRenderer implements Renderer {
  private options: Options;

  constructor(options: Partial<Options>) {
    this.options = { ...options, ...DEFAULT_OPTIONS };
  }

  async render(snippets: Snippets) {
    const { pattern } = this.options;
    const files = await glob(pattern, { cwd: process.cwd(), absolute: true });

    const renderingQueue = queue<ParseInput>(asyncify(parseFile));
    for (const file of files) {
      renderingQueue.push({ file, snippets });
    }
    await renderingQueue.drain();
  }
}
