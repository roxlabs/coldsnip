import { once } from "events";
import glob from "fast-glob";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import createSnippet from "./createSnippet";
import { ensureRepoIsCurrent } from "./git";
import { matchesEndTag, parseStartTag } from "./patterns";
import type { Snippets, SourcePath, SourceRef } from "./types";

async function extractSnippetFromFile(
  filePath: string,
  ref: SourceRef
): Promise<Snippets> {
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
  let content: string[] = [];

  rl.on("line", (line) => {
    currentLine++;
    const openTag = parseStartTag(line);
    if (!open && openTag) {
      open = true;
      key = openTag.key;
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
          qualifier: openTag?.qualifier,
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

type SourceFilesTuple = [string[], SourceRef];
async function extractSnippets(sources: SourcePath[]): Promise<Snippets> {
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
  const files = await Promise.all(promises);
  files.forEach(([paths, input]) => {});
  //   const a = flat(files);
  //   const collectedSnippets = await Promise.all(
  //       files.map(([paths, input]) => {
  //           extractSnippetFromFile(paths, input)
  //       })
  //   );
  const snippets: Snippets = {};
  //   for (const item of collectedSnippets) {
  //     Object.keys(item).forEach((key) => {
  //       snippets[key] = snippets[key] || [];
  //       snippets[key] = [...snippets[key], ...item[key]];
  //     });
  //   }
  return snippets;
}

export default extractSnippets;
