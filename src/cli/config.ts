export const DEFAULT_CONFIG_FILE = ".snippetfy.js";

export async function loadConfig(
  file: string = DEFAULT_CONFIG_FILE
): Promise<string | undefined> {
  const config = require.resolve(file);
  return undefined;
}
