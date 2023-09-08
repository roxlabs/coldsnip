import { writeFile } from "fs/promises";
import { Snippets } from "../types";
import { Renderer } from "./types";

type Options = {
  outputFile: string;
  indentSize: number | undefined;
};

const DEFAULT_OPTIONS: Options = {
  outputFile: "./.coldsnip/snippets.json",
  indentSize: 2,
};

export default class JsonRenderer implements Renderer {
  private options: Options;

  constructor(options: Partial<Options>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  async render(snippets: Snippets) {
    const { outputFile, indentSize } = this.options;
    const json = JSON.stringify(snippets, null, indentSize);
    await writeFile(outputFile, json, { encoding: "utf-8" });
  }
}
