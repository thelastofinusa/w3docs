import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import * as p from "@clack/prompts";
import { fileURLToPath } from "url";

function getPackageRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  let dir = currentDir;
  while (true) {
    if (fs.existsSync(path.join(dir, "package.json"))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error("Could not find package root");
    dir = parent;
  }
}

const PACKAGE_ROOT = getPackageRoot();
const TEMPLATE_DIR = path.resolve(PACKAGE_ROOT, "templates/solidity");

interface ScaffoldOptions {
  targetDir: string;
  displayName: string;
  network: string;
  address: string;
  verified: boolean;
  title: string;
  contractData?: string; // JSON string of UnifiedContract
  rawAbi?: string; // JSON string of raw ABI
}

function detectPackageManager(): string {
  const ua = process.env.npm_config_user_agent ?? "";
  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  if (ua.startsWith("bun")) return "bun";
  return "npm";
}

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
  const {
    targetDir,
    displayName,
    network,
    address,
    verified,
    title,
    contractData,
    rawAbi,
  } = options;

  if (!fs.existsSync(TEMPLATE_DIR)) {
    throw new Error(`Template directory missing: ${TEMPLATE_DIR}`);
  }

  // Copy entire template directory
  fs.copySync(TEMPLATE_DIR, targetDir);

  // Values to replace in .hbs files
  const values = {
    projectName: displayName,
    title: title || displayName,
    description: "Interactive documentation generated from the contract ABI.",
    network,
    address,
    verified: String(verified),
    generatedAt: new Date().toISOString(),
    htmlTitle: `${title || displayName} - w3xp`,
  };

  // Recursively process .hbs files
  const processDir = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules") continue;
        processDir(fullPath);
      } else if (entry.name.endsWith(".hbs")) {
        let content = fs.readFileSync(fullPath, "utf8");
        content = replacePlaceholders(content, values);
        const newPath = fullPath.replace(/\.hbs$/, "");
        if (newPath.endsWith(".json")) {
          try {
            // Ensure JSON is valid
            content = JSON.stringify(JSON.parse(content), null, 2);
          } catch {}
        }
        fs.writeFileSync(newPath, content);
        fs.removeSync(fullPath);
      }
    }
  };
  processDir(targetDir);

  // Write contract.json and abi.json if provided
  const w3xpDir = path.join(targetDir, ".w3xp");
  if (!fs.existsSync(w3xpDir)) fs.mkdirSync(w3xpDir, { recursive: true });
  if (contractData) {
    fs.writeFileSync(path.join(w3xpDir, "contract.json"), contractData);
  }
  if (rawAbi) {
    fs.writeFileSync(path.join(w3xpDir, "abi.json"), rawAbi);
  }

  const pm = detectPackageManager();
  const isCurrentDir = displayName === path.basename(process.cwd());

  const lines = [
    "Next steps:",
    !isCurrentDir && ` → cd ${chalk.bold(displayName)}`,
    ` → ${pm} install`,
    ` → ${pm} dev`,
    "",
    `${chalk.dim(targetDir)}`,
  ];

  p.note(lines.join("\n"), `${chalk.bold(title || displayName)} scaffolded`);

  p.outro(chalk.green("Interactive explorer ready to launch."));
}
