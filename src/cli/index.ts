import { Command, flags } from "@oclif/command";
import extractSnippets from "../extractSnippets";
import { render } from "../renderer";
import { loadConfig } from "./config";
import { OutputFormat } from "./types";

class Snippetfy extends Command {
  static description = "describe the command here";

  static flags: flags.Input<any> = {
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
      options: ["json", "markdown", "include"],
      default: "json",
    }),
    config: flags.string({
      char: "c",
      description: "the path to the config file",
      default: "./snippetfy.json",
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
    let config = await loadConfig(flags.config);

    console.log("run() config is");
    console.log(JSON.stringify(config, null, 2));

    const paths = config?.paths;
    if (paths) {
      paths
    }
    // Array.isArray(config?.paths) ? config?.paths : []

    const snippets = await extractSnippets([
      {
        path: "./",
        pattern: "src/**/*.ts",
      },
    ]);

    await render(snippets, "include");

    // const name = flags.name ?? "world";
    // this.log(`hello ${name} from ./src/index.ts`);
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`);
    // }
  }
}

export default Snippetfy;
