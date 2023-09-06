import { Config } from "./types";
import { readFile } from "fs/promises";
import { resolve } from "path";

export const DEFAULT_CONFIG_FILE = "./snippetfy.json";

export async function loadConfig(
  file: string = DEFAULT_CONFIG_FILE
): Promise<Config | undefined> {
  const config = await readFile(resolve(file));
  return JSON.parse(config.toString()) as Config | undefined;
}
