import { Command, Flags } from "@oclif/core";
import extractSnippets from "../extractSnippets";
import { render } from "../renderer";
import { loadConfig } from "./config";

class Snippetfy extends Command {
  static description = "Extract source code snippets from files";

  static flags = {
    version: Flags.version({ char: "v" }),
    help: Flags.help({ char: "h" }),
    // options
    out: Flags.string({
      char: "o",
      description: "the output path",
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
    const { flags } = await this.parse(Snippetfy);
    let config = await loadConfig(flags.config);

    console.log("run() config is");
    console.log(JSON.stringify(config, null, 2));

    const paths = config?.paths;
    if (paths) {
      paths;
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
