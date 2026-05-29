import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//! ---- paths -----------------------------------------------------
const cliPkgPath = path.resolve(__dirname, "../packages/cli/package.json");
const corePkgPath = path.resolve(__dirname, "../packages/core/package.json");

//! ---- read current versions -------------------------------------
const cliPkg = JSON.parse(readFileSync(cliPkgPath, "utf8"));
const corePkg = JSON.parse(readFileSync(corePkgPath, "utf8"));

const cliVersion = cliPkg.version;
const coreVersion = corePkg.version;

//! ---- 1. Update the CLI's own dependency on @w3xp/core ----------
if (cliPkg.dependencies && cliPkg.dependencies["@w3xp/core"]) {
  cliPkg.dependencies["@w3xp/core"] = `^${coreVersion}`;
  writeFileSync(cliPkgPath, JSON.stringify(cliPkg, null, 2) + "\n");
  console.log(`✅ CLI updated: @w3xp/core -> ^${coreVersion}`);
}
