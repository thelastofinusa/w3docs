import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

export async function devCommand() {
  const cwd = process.cwd();
  const viteConfig = path.resolve(cwd, "vite.config.ts");

  if (!fs.existsSync(viteConfig)) {
    console.error(
      "❌ No vite.config.ts found. Are you inside a w3docs project?",
    );
    process.exit(1);
  }

  console.log("🚀 Starting development server...");
  try {
    await execa("vite", ["--config", "vite.config.ts"], {
      cwd,
      stdio: "inherit",
      preferLocal: true, // uses ./node_modules/.bin/vite
    });
  } catch (error: any) {
    console.error("Dev server exited with error:", error.message);
    process.exit(1);
  }
}
