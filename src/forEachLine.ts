import { once } from "events";
import fs from "fs";
import path from "path";
import * as readline from "readline";

type Line = {
  lineNumber: number;
  lineContent: string;
};

async function forEachLine(filePath: string, handler: (line: Line) => void) {
  const stream = fs.createReadStream(path.resolve(filePath));
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;
  rl.on("line", (lineContent) => {
    lineNumber++;
    handler({ lineNumber, lineContent });
  });
  await once(rl, "close");
}

export default forEachLine;
