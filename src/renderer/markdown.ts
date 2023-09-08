import { asyncify, queue } from "async";
import { writeFile } from "fs/promises";
import { join as joinPath } from "path";
import { Snippet, Snippets } from "../types";
import { Renderer } from "./types";

type Options = {
  outputDir: string;
};

type ProcessingInput = {
  directory: string;
  key: string;
  snippet: Snippet;
};

const DEFAULT_OPTIONS: Options = {
  outputDir: "./coldsnip/",
};

function codeBlock(snippet: Snippet): string {
  let link = "";
  if (snippet.permalink) {
    link = `[${snippet.sourcePath}#${snippet.startLine}:${snippet.endLine}](${snippet.permalink})`;
  }
  return `
  \`\`\`${snippet.language}
  ${snippet.content}
  \`\`\`
  ${link}
  `;
}

async function process(input: ProcessingInput) {
  const { directory, key, snippet } = input;
  const qualifier = snippet.qualifier ? `-${snippet.qualifier}` : "";
  const filename = `${key}${qualifier}.${snippet.language}.md`;
  const file = joinPath(directory, filename);
  await writeFile(file, codeBlock(snippet), { encoding: "utf-8" });
}

export default class MarkdownRenderer implements Renderer {
  private options: Options;

  constructor(options: Partial<Options>) {
    this.options = { ...options, ...DEFAULT_OPTIONS };
  }

  async render(snippets: Snippets) {
    const { outputDir } = this.options;
    const renderingQueue = queue<ProcessingInput>(asyncify(process));
    // enqueue all snippets
    Object.keys(snippets).forEach((key) => {
      snippets[key].forEach((snippet) => {
        renderingQueue.push({
          key,
          snippet,
          directory: outputDir,
        });
      });
    });
    await renderingQueue.drain();
  }
}
