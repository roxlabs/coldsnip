import esbuild from "rollup-plugin-esbuild";

const name = require("./package.json").name;

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `dist/${name}.cjs`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `dist/${name}.mjs`,
        format: "es",
        sourcemap: true,
      },
    ],
  }),
];
