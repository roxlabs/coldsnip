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

/**
 * Serialize an array of highlighted line numbers to a string format
 * compatible with syntax highlighters.
 *
 * Given an array of highlighted lines like `[2,5,6,7,15,20,21,23]`,
 * the output format will be "2,5-7,15,20-21,23".
 *
 * @param {number[]} lines - Array of line numbers to serialize.
 * @returns {string} Serialized string of highlighted lines.
 */
function formatHighlightedLines(lines: number[]): string {
  if (lines.length === 0) {
    return "";
  }

  lines.sort((a, b) => a - b);
  const serialized: string[] = [];

  let start = lines[0];
  let end = lines[0];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === end + 1) {
      end = lines[i];
    } else {
      if (start === end) {
        serialized.push(start.toString());
      } else {
        serialized.push(`${start}-${end}`);
      }

      start = lines[i];
      end = lines[i];
    }
  }

  // Handle the last group
  if (start === end) {
    serialized.push(start.toString());
  } else {
    serialized.push(`${start}-${end}`);
  }

  return serialized.join(",");
}

/**
 * Type definition for options that can be passed to the `codeBlock` function.
 */
export type CodeBlockOptions = {
  /**
   * Whether to highlight specific lines in the code block.
   * Defaults to `true`.
   */
  highlightLines?: boolean;
  /**
   * Whether to show line numbers in the code block.
   * Defaults to `false`.
   */
  showLineNumbers?: boolean;
  /**
   * Whether to show a permalink to the source code.
   * Defaults to `false`.
   */
  showPermalink?: boolean;
  /**
   * Whether to show the filename above the code block.
   * Defaults to `false`.
   */
  showFilename?: boolean;
};

/**
 * Generates a Markdown-formatted code block from a code snippet object.
 *
 * This function takes a `Snippet` object and an optional `CodeBlockOptions` object
 * to customize the output. It returns a string containing the Markdown code
 * block, ready to be inserted into a Markdown document.
 *
 * @param {Snippet} snippet - The code snippet object.
 * @param {CodeBlockOptions} [options] - Optional configuration options.
 * @returns {string} Markdown-formatted code block.
 */
export function codeBlock(
  snippet: Snippet,
  options: CodeBlockOptions = {},
): string {
  const {
    highlightLines = true,
    showLineNumbers = false,
    showPermalink = false,
    showFilename = false,
  } = options;
  let link = "";
  if (showPermalink && snippet.permalink) {
    link = `[${snippet.sourcePath}#${snippet.startLine}:${snippet.endLine}](${snippet.permalink})`;
  }
  const config = [snippet.language];
  if (highlightLines && snippet.highlightedLines.length > 0) {
    config.push(`{${formatHighlightedLines(snippet.highlightedLines)}}`);
  }
  if (showLineNumbers) {
    config.push("showLineNumbers");
  }
  if (showFilename) {
    config.push(`filename=${snippet.filename}`);
  }

  const block = [`\`\`\`${config.join(" ")}`];
  block.push(snippet.content);
  block.push("```");
  return block.join("\n");
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
