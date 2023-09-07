import { Command, Flags } from "@oclif/core";
import extractSnippets from "../extractSnippets";
import { render } from "../renderer";
import { loadConfig } from "./config";
import { Config } from "./types";

function parseURL(url: string): URL | undefined {
  try {
    return new URL(url);
  } catch (error) {
    return undefined;
  }
}

class Snippetfy extends Command {
  static description = "Extract source code snippets from files";

  static flags = {
    version: Flags.version({ char: "v" }),
    help: Flags.help({ char: "h" }),
    // options
    out: Flags.string({
      char: "o",
      description: "the output path (directory or file)",
      default: "./snippets",
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
      default: "./snippetfy.json",
      exclusive: ["source"],
    }),
    source: Flags.string({
      char: "s",
      required: false,
      description: "the local path or Git repo URL to fetch files from",
    }),
    pattern: Flags.string({
      char: "p",
      default:
        "**/*.{js,jsx,ts,tsx,go,java,rb,py,php,cs,sh,sql,kt,yml,yaml,json,md}",
      required: false,
      dependsOn: ["source"],
      description: "the file match pattern, e.g. src/**/*.js",
    }),
  };

  async run() {
    const { flags } = await this.parse(Snippetfy);
    const { config, source, pattern, format, out: outputPath } = flags;
    let parsedConfig: Config | undefined;
    if (typeof source === "string") {
      console.log("Let's parse the source flag");
      const url = parseURL(source);
      parsedConfig = {
        paths: url
          ? { url: source, pattern: pattern }
          : { path: source, pattern: pattern },
      };
    } else if (config) {
      console.log("Let's load the config file");
      parsedConfig = await loadConfig(flags.config);
      if (!parsedConfig) {
        console.error(`Could not load config file: ${flags.config}`);
        process.exit(1);
      }
    }
    console.log("Here's the config: ", parsedConfig);

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
    await render(snippets, format as any, {
      outputDir: outputPath,
      outputFile: outputPath,
    });
  }
}

export default Snippetfy;
