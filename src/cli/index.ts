import { Command, flags } from "@oclif/command";
import extractSnippets from "../extractSnippets";
import { loadConfig } from "./config";
import { OutputFormat } from "./types";

class Snippetfy extends Command {
  static description = "describe the command here";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    // options
    out: flags.string({
      char: "o",
      description: "the output path",
      default: "./snippets",
    }),
    format: flags.enum<OutputFormat>({
      char: "f",
      description: "the output format",
      options: ["json", "markdown"],
      default: "json",
    }),
    config: flags.string({
      char: "c",
      description: "the path to the config file",
    }),
    source: flags.string({
      char: "s",
      required: false,
      description: "the local path or Git repo URL to fetch files from",
    }),
    pattern: flags.string({
      char: "p",
      required: false,
      dependsOn: ["source"],
      description: "the file match pattern, e.g. src/**/*.js",
    }),
  };

  async run() {
    const { flags } = this.parse(Snippetfy);

    const configFile = flags.config;
    const config = await loadConfig(configFile);
    if (configFile && !config) {
      // error
    }

    const snippets = await extractSnippets([]);
    if (flags.format === "json") {
      JSON.stringify(snippets, null, 2);
    }

    // const name = flags.name ?? "world";
    // this.log(`hello ${name} from ./src/index.ts`);
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }
  }
}

export default Snippetfy;
