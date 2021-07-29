import flat from "array.prototype.flat";
import { once } from "events";
import glob from "fast-glob";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import stripIndent from "strip-indent";
import { parseStartTag, matchesEndTag } from "./patterns";

interface Snippet {
  language: string;
  sourcePath: string;
  startLine: number;
  endLine: number;
  content: string;
  permalink?: string;
}

interface LocalPath {
  path: string;
  pattern: string;
}

interface GitRepo {
  url: string;
  pattern: string;
  tag?: string;
  branch?: string;
}

type Snippets = { [key: string]: Snippet[] };

async function extractSnippetFromFile(filePath: string): Promise<Snippets> {
  console.log("path", path.resolve(filePath));
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
      snippets[key] = [
        {
          language: path.extname(filePath).slice(1),
          sourcePath: "",
          content: stripIndent(content.join("\n")).trim(),
          startLine: startLine as number,
          endLine: currentLine - 1,
        },
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

async function extractSnippets(
  sources: Array<LocalPath | GitRepo>
): Promise<Snippets> {
  const promises: Array<Promise<string[]>> = [];
  for (const source of sources) {
    if ("path" in source) {
      promises.push(glob(source.pattern, { cwd: source.path, absolute: true }));
    } else if ("url" in source) {
      console.log("TODO");
    }
  }
  const allFiles = await Promise.all(promises);
  const files = flat(allFiles);
  const collectedSnippets = await Promise.all(
    files.map(extractSnippetFromFile)
  );
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
