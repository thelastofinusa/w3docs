import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

export async function buildCommand() {
  const cwd = process.cwd();
  const viteConfig = path.resolve(cwd, "vite.config.ts");

  if (!fs.existsSync(viteConfig)) {
    console.error(
      "❌ No vite.config.ts found. Are you inside a w3docs project?",
    );
    process.exit(1);
  }

  console.log("📦 Building project...");
  try {
    await execa("vite", ["build", "--config", "vite.config.ts"], {
      cwd,
      stdio: "inherit",
      preferLocal: true,
    });
  } catch (error: any) {
    console.error("Build failed:", error.message);
    process.exit(1);
  }
}
