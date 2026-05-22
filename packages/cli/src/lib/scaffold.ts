import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import color from "chalk";
import * as p from "@clack/prompts";
import { fileURLToPath } from "url";
import { createSpinner, sleep } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Template directory lives in apps/templates/default
const TEMPLATE_DIR = path.resolve(
  __dirname,
  "../../../../apps/templates/default",
);

interface ScaffoldOptions {
  projectName: string;
  chain: string;
  address: string;
  verified: boolean;
  title?: string;
  language?: string;
  autoInstall?: boolean; // we can add a --no-install flag later
}

/**
 * Detect the package manager from the user agent string.
 * Returns one of: npm, pnpm, yarn, bun, or npm as fallback.
 */
function detectPackageManager(): string {
  const ua = process.env.npm_config_user_agent ?? "";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  if (ua.startsWith("bun")) return "bun";
  return "npm"; // default
}

/**
 * Replace all {{key}} in the file content with the given values
 */
function replacePlaceholders(
  content: string,
  values: Record<string, string>,
): string {
  return content.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => values[key] ?? `{{${key}}}`,
  );
}

export async function scaffoldProject(options: ScaffoldOptions) {
  const { projectName, chain, address, verified, title, language } = options;
  const targetDir = path.resolve(process.cwd(), projectName);

  if (fs.existsSync(targetDir)) {
    throw new Error(`Directory "${projectName}" already exists.`);
  }

  const spinner = createSpinner("cyan");
  spinner.start(color.cyan("Scaffolding documentation project"));
  await sleep(1500);

  // 1. Verify template exists and copy it
  if (!fs.existsSync(TEMPLATE_DIR)) {
    spinner.stop("Template directory not found");
    throw new Error(`Template missing at ${TEMPLATE_DIR}`);
  }
  fs.copySync(TEMPLATE_DIR, targetDir);

  spinner.message(color.cyan("Copying default template"));
  await sleep(1200);

  spinner.message(color.cyan("Compiling .hbs files"));
  await sleep(800);

  // 2. Values to inject
  const values = {
    projectName,
    title: title || projectName,
    chain,
    address,
    verified: String(verified),
  };

  // 3. Process .hbs files recursively
  const processDirectory = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        processDirectory(fullPath);
      } else if (entry.name.endsWith(".hbs")) {
        let raw = fs.readFileSync(fullPath, "utf8");
        raw = replacePlaceholders(raw, values);

        const newPath = fullPath.replace(/\.hbs$/, "");

        if (newPath.endsWith(".json")) {
          try {
            const parsed = JSON.parse(raw);
            raw = JSON.stringify(parsed, null, 2);
          } catch {
            /* leave as-is if not valid JSON */
          }
        }

        fs.writeFileSync(newPath, raw);
        fs.removeSync(fullPath);
      }
    }
  };

  processDirectory(targetDir);

  // 4. Detect package manager and install dependencies
  const pm = detectPackageManager();
  spinner.message(color.cyan(`Installing dependencies with ${pm}`));
  try {
    execSync(`${pm} install`, { cwd: targetDir, stdio: "pipe" });
    await sleep(1000);
  } catch (error: any) {
    spinner.stop(color.red("Dependency installation failed"));
    p.log.warn(
      `Installation failed. You can run \`cd ${projectName} && ${pm} install\` manually.`,
    );
    // Don't throw – project is still scaffolded
  }

  spinner.stop(color.green("Project generated successfully."));

  // Summary message
  p.log.message(
    [
      `${color.cyan("→")} ${color.bold("Language")}   ${color.gray(language ?? "Solidity")}`,
      `${color.cyan("→")} ${color.bold("Network")}    ${color.gray(chain)}`,
      `${color.cyan("→")} ${color.bold("Address")}    ${color.gray(address)}`,
      `${color.cyan("→")} ${color.bold("Directory")}  ${color.gray(`./${projectName}`)}`,
    ].join("\n"),
  );

  p.outro(
    [
      `${color.cyan(`Build complete. ${color.bold("Your on-chain interface is ready.")}`)}`,
      "",
      `${color.bold("Next steps:")}`,
      ` ${color.cyan("$")} cd ${projectName}`,
      ` ${color.cyan("$")} ${pm} install`,
      ` ${color.cyan("$")} ${pm} run dev`,
    ].join("\n"),
  );

  return targetDir;
}
