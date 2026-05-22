import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  dts: true,
  banner: {
    js: "#!/usr/bin/env node",
  },
  external: [
    "fs-extra",
    "handlebars",
    "execa",
    "chalk",
    "commander",
    "figlet",
    "gradient-string",
    "ora",
    "@clack/prompts",
    "@w3docs/core",
  ],
});
