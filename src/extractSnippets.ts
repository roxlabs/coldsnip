import { asyncify, queue } from "async";
import { once } from "events";
import glob from "fast-glob";
import * as fs from "fs";
import { cpus } from "os";
import * as path from "path";
import * as readline from "readline";
import createSnippet from "./createSnippet";
import { ensureRepoIsCurrent } from "./git";
import { matchesEndTag, parseStartTag } from "./patterns";
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
  sources: SourcePath[]
): Promise<SourceFilesTuple[]> {
  const promises: Array<Promise<SourceFilesTuple>> = [];
  for (const source of sources) {
    if ("path" in source) {
      // local directories are straighforward to handle
      promises.push(
        Promise.all([
          glob(source.pattern, { cwd: source.path, absolute: true }),
          Promise.resolve({ directory: source.path }),
        ])
      );
    } else if ("url" in source) {
      // remote git repos need to be pulled/cloned
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
        ])
      );
    }
  }
  return Promise.all(promises);
}

/**
 * @internal
 * @param record
 * @returns
 */
async function extractSnippetFromFile(
  record: SourceFileRecord
): Promise<Snippets> {
  const { filePath, ref } = record;
  const stream = fs.createReadStream(path.resolve(filePath));
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  const snippets: Snippets = {};
  let currentLine = 0;
  let open = false;
  let startLine: number | undefined = undefined;
  let key: string | undefined = undefined;
  let qualifier: string | undefined = undefined;
  let content: string[] = [];

  rl.on("line", (line) => {
    currentLine++;
    const openTag = parseStartTag(line);
    if (!open && openTag) {
      open = true;
      key = openTag.key;
      qualifier = openTag.qualifier;
      startLine = currentLine + 1;
    } else if (open && matchesEndTag(line) && key) {
      const endLine = currentLine - 1;
      const { repoUrl, commit, directory } = ref;
      snippets[key] = [
        createSnippet({
          content: content.join("\n"),
          directory,
          filePath,
          startLine: startLine as number,
          endLine,
          repoUrl,
          commit,
          qualifier,
        }),
      ];
      open = false;
      startLine = undefined;
      key = undefined;
      content = [];
    } else if (open) {
      content.push(line);
    }
  });

  await once(rl, "close");
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
 *   { url: "https://github.com/roxlabs/snippetfy", pattern: "*.ts" },
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
  // setup the processing queue and result aggregator
  const collectedSnippets: Array<Snippets> = [];
  const concurrency = cpus().length * 2;
  const worker = async (record: SourceFileRecord) => {
    const snippet = await extractSnippetFromFile(record);
    collectedSnippets.push(snippet);
  };
  const extractorQueue = queue<SourceFileRecord>(asyncify(worker), concurrency);

  // Find all files, either from local path or a git repo
  const files = await findFiles(sources);

  // TODO: can this be improved?
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
  return snippets;
}

export default extractSnippets;
