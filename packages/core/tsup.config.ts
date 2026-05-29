import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "solidity/index": "src/solidity/index.ts",
  },
  format: ["esm"],
  dts: true,
  clean: true,
});
