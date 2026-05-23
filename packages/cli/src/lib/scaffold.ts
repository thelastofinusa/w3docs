import fs from "fs-extra"
import path from "path"
import { execa } from "execa"
import chalk from "chalk"
import * as p from "@clack/prompts"
import { fileURLToPath } from "url"

// ---- locate the CLI package root ----
function getPackageRoot(): string {
  const currentDir = path.dirname(fileURLToPath(import.meta.url))

  let dir = currentDir

  while (true) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      return dir
    }

    const parent = path.dirname(dir)

    if (parent === dir) {
      throw new Error("Could not find package root")
    }

    dir = parent
  }
}

const PACKAGE_ROOT = getPackageRoot()
const TEMPLATE_DIR = path.resolve(PACKAGE_ROOT, "templates/default")

interface ScaffoldOptions {
  targetDir: string
  displayName: string
  chain: string
  address: string
  verified: boolean
  title?: string
  language?: string
  spinner: ReturnType<typeof p.spinner>
  contractData?: string
  rawAbi?: string
  description?: string
}

function detectPackageManager(): string {
  const ua = process.env.npm_config_user_agent ?? ""

  if (ua.startsWith("pnpm")) return "pnpm"
  if (ua.startsWith("yarn")) return "yarn"
  if (ua.startsWith("bun")) return "bun"

  return "npm"
}

function replacePlaceholders(
  content: string,
  values: Record<string, string>
): string {
  return content.replace(
    /\{\{(\w+)\}\}/g,
    (_, key) => values[key] ?? `{{${key}}}`
  )
}

export async function scaffoldProject(options: ScaffoldOptions) {
  const {
    targetDir,
    displayName,
    chain,
    address,
    verified,
    title,
    spinner,
    contractData,
    rawAbi,
    description,
  } = options

  // 1. Verify template exists
  if (!fs.existsSync(TEMPLATE_DIR)) {
    throw new Error(`Template missing at ${TEMPLATE_DIR}`)
  }

  // 2. Generate project
  spinner.start(chalk.cyan("Scaffolding documentation project"))

  fs.copySync(TEMPLATE_DIR, targetDir)

  const values = {
    projectName: displayName,
    title: title || displayName,
    description: description as string,
    chain,
    address,
    verified: String(verified),
    generatedAt: new Date().toISOString(),
    htmlTitle:
      displayName !== (title || displayName)
        ? `${title || displayName} – ${displayName}`
        : `${displayName} – w3docs`,
  }

  const processDirectory = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        if (entry.name === "node_modules") continue

        processDirectory(fullPath)
      } else if (entry.name.endsWith(".hbs")) {
        let raw = fs.readFileSync(fullPath, "utf8")

        raw = replacePlaceholders(raw, values)

        const newPath = fullPath.replace(/\.hbs$/, "")

        if (newPath.endsWith(".json")) {
          try {
            const parsed = JSON.parse(raw)
            raw = JSON.stringify(parsed, null, 2)
          } catch {}
        }

        fs.writeFileSync(newPath, raw)
        fs.removeSync(fullPath)
      }
    }
  }

  processDirectory(targetDir)

  if (contractData) {
    fs.writeFileSync(
      path.join(targetDir, ".w3docs", "contract.json"),
      contractData
    )
  }

  if (rawAbi) {
    fs.writeFileSync(path.join(targetDir, ".w3docs", "abi.json"), rawAbi)
  }

  spinner.stop(chalk.green("Project scaffolded successfully"))

  // 3. Install dependencies
  const pm = detectPackageManager()

  spinner.start(chalk.cyan(`Installing dependencies (${pm})`))

  let installFailed = false

  try {
    await execa(pm, ["install"], {
      cwd: targetDir,
      stdio: "pipe",
    })
  } catch {
    installFailed = true
  }

  if (installFailed) {
    spinner.stop(chalk.red("Dependency installation failed"))

    p.log.warn(
      chalk.yellow(`Run ${chalk.bold(`${pm} install`)} manually to continue.`)
    )

    return targetDir
  }

  spinner.stop(chalk.green("Dependencies installed"))

  try {
    await execa(pm, ["run", "dev"], {
      cwd: targetDir,
      stdio: "inherit",
      preferLocal: true,
    })
  } catch (error: any) {
    p.log.error(error.message)
  }

  return targetDir
}
