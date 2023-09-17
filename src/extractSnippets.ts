import { asyncify, queue } from "async";
import glob from "fast-glob";
import { cpus } from "os";
import createSnippet from "./createSnippet";
import forEachLine from "./forEachLine";
import { ensureRepoIsCurrent, getLocalRepoInfo } from "./git";
import {
  highlightedLine,
  isSnippetStartTag,
  matchesEndTag,
  matchesStartTag,
} from "./patterns";
import type { Snippets, SourcePath, SourceRef } from "./types";

type SourceFilesTuple = [string[], SourceRef];
type SourceFileRecord = { filePath: string; ref: SourceRef };

/**
 *
 * @internal
 * @param sources a list of source paths (local or git repos) to search for files
 * @returns a list of tuples, containing their source path and the array of matched files.
 */
export async function findFiles(
  sources: SourcePath[],
): Promise<SourceFilesTuple[]> {
  const promises: Array<Promise<SourceFilesTuple>> = [];
  for (const source of sources) {
    if ("path" in source) {
      // when in local paths, try to get git info if possible
      const { repoUrl, commit } = await getLocalRepoInfo(source.path);
      promises.push(
        Promise.all([
          glob(source.pattern, { cwd: source.path, absolute: true }),
          Promise.resolve({ directory: source.path, repoUrl, commit }),
        ]),
      );
    } else if ("url" in source) {
      // remote git repos need to be cloned
      const ref = await ensureRepoIsCurrent(source);
      const { workingDir, commit } = ref;
      promises.push(
        Promise.all([
          glob(source.pattern, { cwd: workingDir, absolute: true }),
          Promise.resolve({
            directory: workingDir,
            repoUrl: source.url,
            commit,
          }),
        ]),
      );
    }
  }
  return Promise.all(promises);
}

type ParserState =
  | "OUTSIDE_SNIPPET"
  | "INSIDE_SNIPPET"
  | "INSIDE_HIGHLIGHT_BLOCK";

/**
 * Extracts code snippets from a given source file, according to specific markers.
 * This uses a very simple parsing logic, the idea is to keep it simple and avoid
 * adding complicated or advanced syntax to the tags.
 *
 * The function uses a state machine with three states to accomplish this:
 *
 * - `OUTSIDE_SNIPPET`: Looking for the start of a new snippet.
 * - `INSIDE_SNIPPET`: Inside a snippet, looking for lines to include or the end of the snippet.
 * - `INSIDE_HIGHLIGHT_BLOCK`: Inside a block of lines that should be highlighted.
 *
 * #### Tags Used:
 *
 * - `@snippet:start`: Marks the start of a new snippet.
 * - `@snippet:end`: Marks the end of a snippet.
 * - `@highlight`: Highlights the current line in the snippet.
 * - `@highlight:start`: Marks the start of a block of lines to highlight.
 * - `@highlight:end`: Marks the end of a block of lines to highlight.
 *
 * #### Error Handling:
 *
 * The function checks for invalid states and throws errors with descriptive messages.
 * These include:
 *
 * - `@highlight` or `@highlight:start` tags outside of a snippet.
 * - `@highlight:end` without a corresponding `@highlight:start`.
 * - An unclosed snippet (`@snippet:start` without a corresponding `@snippet:end`).
 *
 * @param {SourceFileRecord} record - Record containing the file path and reference information.
 * @returns {Promise<Snippets>} A promise that resolves to an object containing the extracted snippets.
 *
 * @throws {Error} Throws an error if an invalid state is encountered.
 *
 * @async
 * @internal
 */
async function extractSnippetFromFile(
  record: SourceFileRecord,
): Promise<Snippets> {
  const { filePath, ref } = record;

  const snippets: Snippets = {};
  let state: ParserState = "OUTSIDE_SNIPPET";
  let startLine: number | undefined = undefined;
  let key: string | undefined = undefined;
  let qualifier: string | undefined = undefined;
  let content: string[] = [];
  let highlightedLines: number[] = [];

  await forEachLine(filePath, async (line) => {
    const { lineContent, lineNumber } = line;
    const openTag = matchesStartTag(lineContent);

    switch (state) {
      case "OUTSIDE_SNIPPET":
        if (isSnippetStartTag(openTag)) {
          state = "INSIDE_SNIPPET";
          key = openTag.args.id;
          qualifier = openTag.args.qualifier;
          startLine = lineNumber + 1;
        } else if (
          lineContent.includes("@highlight") ||
          lineContent.includes("@highlight:start")
        ) {
          // TODO improve error state detection
          throw new Error(
            `Invalid state: '@highlight' or '@highlight:start' found outside a snippet at line ${lineNumber}`,
          );
        }
        break;

      case "INSIDE_SNIPPET":
        const isHighlighted = highlightedLine(lineContent);
        if (isHighlighted) {
          content.push(isHighlighted.trimEnd());
          highlightedLines.push(content.length);
          return;
        } else if (openTag && openTag.name === "highlight") {
          state = "INSIDE_HIGHLIGHT_BLOCK";
        } else if (matchesEndTag(lineContent)?.name === "snippet") {
          state = "OUTSIDE_SNIPPET";
          const endLine = lineNumber - 1;
          const { repoUrl, commit, directory } = ref;

          snippets[key as string] = [
            createSnippet({
              content: content.join("\n"),
              directory,
              filePath,
              startLine: startLine as number,
              endLine,
              repoUrl,
              commit,
              qualifier,
              highlightedLines,
            }),
          ];
          startLine = undefined;
          key = undefined;
          content = [];
          highlightedLines = [];
        } else {
          content.push(lineContent.trimEnd());
        }
        break;

      case "INSIDE_HIGHLIGHT_BLOCK":
        if (matchesEndTag(lineContent)?.name === "highlight") {
          state = "INSIDE_SNIPPET";
        } else {
          content.push(lineContent.trimEnd());
          highlightedLines.push(content.length);
        }
        break;

      default:
        throw new Error(`Unknown parser state: ${state}`);
    }
  });

  // Check for missing '@snippet:end'
  if ((state as ParserState) === "INSIDE_SNIPPET") {
    throw new Error(
      `Invalid state: '@snippet:start' found but '@snippet:end' is missing in file ${filePath}`,
    );
  }

  // Check for missing '@highlight:end'
  if ((state as ParserState) === "INSIDE_HIGHLIGHT_BLOCK") {
    throw new Error(
      `Invalid state: '@highlight:start' found but '@highlight:end' is missing in file ${filePath}`,
    );
  }

  return snippets;
}

/**
 * The main function of the library. It takes a list of {@link SourcePath} that represents
 * local directories or Git repositories where source files containing tagged code snippets
 * will be parsed and extracted into an indexed data structure (represented by {@link Snippets}).
 *
 * ```js
 * const snippets = await extractSnippets([
 *   { path: "~/dev/projects/local", pattern: "*.js" },
 *   { url: "https://github.com/roxlabs/coldsnip", pattern: "*.ts" },
 * ]);
 * ```
 *
 * @name extractSnippets
 * @public
 * @param sources a collection of local or remote (_i.e._ Git) sources.
 * @returns an object indexed by a key, representing the snippet identifier and an array of one
 * or more code snippets.
 */
async function extractSnippets(sources: SourcePath[]): Promise<Snippets> {
  // Find all files, either from local path or a git repo
  const files = await findFiles(sources);
  if (files.length === 0) {
    return {};
  }

  // setup the processing queue and result aggregator
  const collectedSnippets: Array<Snippets> = [];
  const concurrency = cpus().length * 2;
  const worker = async (record: SourceFileRecord) => {
    const snippet = await extractSnippetFromFile(record);
    collectedSnippets.push(snippet);
  };

  const extractorQueue = queue<SourceFileRecord>(asyncify(worker), concurrency);
  files.forEach(([paths, ref]) => {
    paths.forEach((filePath) => {
      extractorQueue.push({ filePath, ref });
    });
  });

  // wait for the queue to process all tasks
  await extractorQueue.drain();

  // and then aggregate the results into a single Snippets object
  // merging the ones with the same key
  const snippets: Snippets = {};
  for (const item of collectedSnippets) {
    Object.keys(item).forEach((key) => {
      snippets[key] = snippets[key] || [];
      snippets[key] = [...snippets[key], ...item[key]];
    });
  }
  extractorQueue.kill();
  return snippets;
}

export default extractSnippets;
