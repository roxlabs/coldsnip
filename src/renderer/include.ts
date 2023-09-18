import { asyncify, queue } from "async";
import glob from "fast-glob";
import { writeFile } from "fs/promises";
import { EOL } from "os";
import process from "process";
import forEachLine from "../forEachLine";
import lookupSnippet from "../lookupSnippet";
import { matchesEndTag, matchesStartTag, OpenTag } from "../patterns";
import type { Snippets } from "../types";
import { codeBlock, CodeBlockOptions } from "./markdown";
import type { Renderer } from "./types";

type Options = {
  pattern: string | string[];
};

const DEFAULT_OPTIONS: Options = {
  pattern: "**/*.{md,mdx}",
};

const TAG_PATTERN = /^(\s*)<!---?\s*@snippet:include\((.*)\)\s*-?-->/;
const CODE_FENCE_PATTERN = /^(\s*)```/;
const CODE_FENCE = "```";

type IncludeStartTag = OpenTag & {
  args: {
    id: string;
    language?: string;
    qualifier?: string;
  } & CodeBlockOptions;
};

export function isIncludeStartTag(
  tag: OpenTag | undefined,
): tag is IncludeStartTag {
  return (
    tag !== undefined &&
    tag.name === "include" &&
    typeof tag.args?.id === "string"
  );
}

type FileRenderStep = "content" | "tag";

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

    const includeTag = matchesStartTag(lineContent);
    switch (step) {
      case "content":
        content.push(lineContent);
        if (isIncludeStartTag(includeTag)) {
          shouldRewrite = true;
          step = "tag";
          // const indent = includeTag.indent;

          const snippet = lookupSnippet(snippets, {
            key: includeTag.args.id,
            language: includeTag.args.language,
            qualifier: includeTag.args.qualifier,
          });
          if (snippet) {
            content.push("", codeBlock(snippet, { ...includeTag.args }), "");
          } else {
            console.warn(`Snippet with key "${includeTag.args.id}" not found`);
          }
        }
        break;
      case "tag":
        if (matchesEndTag(lineContent)?.name === "include") {
          step = "content";
          content.push(lineContent);
        }
        break;
    }
  });

  if (shouldRewrite) {
    await writeFile(file, content.join("\n") + EOL, { encoding: "utf-8" });
  }
}

export default class IncludeRenderer implements Renderer {
  private options: Options;

  constructor(options: Partial<Options>) {
    this.options = { ...options, ...DEFAULT_OPTIONS };
  }

  async render(snippets: Snippets) {
    const { pattern } = this.options;
    const files = await glob(pattern, {
      cwd: process.cwd(),
      absolute: true,
      ignore: ["./node_modules/**"],
    });

    const renderingQueue = queue<ParseInput>(asyncify(parseFile));
    for (const file of files) {
      renderingQueue.push({ file, snippets });
    }
    await renderingQueue.drain();
  }
}
