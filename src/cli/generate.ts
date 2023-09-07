import { Command, Flags } from "@oclif/core";
import { DEFAULT_CONFIG_FILE, loadConfig } from "../config";
import extractSnippets from "../extractSnippets";
import { render } from "../renderer";
import { Config } from "../types";

function parseURL(url: string): URL | undefined {
  try {
    return new URL(url);
  } catch (error) {
    return undefined;
  }
}

const DEFAULT_SOURCE_FILES_PATTERN =
  "**/*.{js,jsx,ts,tsx,go,java,rb,py,php,cs,sh,sql,kt,yml,yaml,json,md}";

class GenerateCommand extends Command {
  static description = "Generate code snippets from source files";

  static flags = {
    version: Flags.version({ char: "v" }),
    help: Flags.help({ char: "h" }),
    // options
    out: Flags.string({
      char: "o",
      description: "the output path (directory or file)",
    }),
    format: Flags.string({
      char: "f",
      description: "the output format",
      options: ["json", "markdown", "include"],
      default: "json",
    }),
    config: Flags.string({
      char: "c",
      description: "the path to the config file",
      default: DEFAULT_CONFIG_FILE,
      exclusive: ["source"],
    }),
    source: Flags.string({
      char: "s",
      required: false,
      description: "the local path or Git repo URL to fetch files from",
    }),
    pattern: Flags.string({
      char: "p",
      required: false,
      dependsOn: ["source"],
      description: "the file match pattern, e.g. src/**/*.js",
    }),
  };

  async run() {
    const { flags } = await this.parse(GenerateCommand);
    const {
      config,
      source,
      pattern = DEFAULT_SOURCE_FILES_PATTERN,
      format,
      out: outputPath,
    } = flags;
    let parsedConfig: Config | undefined;
    if (typeof source === "string") {
      const url = parseURL(source);
      parsedConfig = {
        paths: url
          ? { url: source, pattern: pattern }
          : { path: source, pattern: pattern },
      };
    } else if (config) {
      parsedConfig = await loadConfig(flags.config);
      if (!parsedConfig) {
        console.error(`Could not load config file: ${flags.config}`);
        process.exit(1);
      }
    }

    if (!parsedConfig) {
      console.error(
        "Could not resolve configuration. Pass a valid config file or a source path.",
      );
      process.exit(1);
    }

    const snippets = await extractSnippets(
      Array.isArray(parsedConfig.paths)
        ? parsedConfig.paths
        : [parsedConfig.paths],
    );

    // TODO: proper error handling for invalid renderer
    // TODO: improve renderer option passing
    await render(
      snippets,
      format as any,
      outputPath
        ? {
            outputDir: outputPath,
            outputFile: outputPath,
          }
        : {},
    );
  }
}

export default GenerateCommand;
