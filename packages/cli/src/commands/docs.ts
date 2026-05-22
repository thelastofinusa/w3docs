import color from "chalk";
import figlet from "figlet";
import * as p from "@clack/prompts";

import pkg from "../../package.json";
import { CONTRACT_TYPES } from "../lib/constants";
import { scaffoldProject } from "../lib/scaffold";
import { createSpinner, renderIntro } from "../lib/utils";
import path from "path";

const { name, description } = pkg;

export default async function generateDocs(initialLanguage?: string) {
  const banner = figlet.textSync(name, { font: "ANSI Shadow" });

  console.log(color.cyan(banner));

  try {
    renderIntro({
      badge: `Welcome to ${color.bgCyan(` ${name} `)}`,
      title: description,
      iconColor: "cyan",
    });

    let language = initialLanguage;

    // Skip language selection if passed via CLI flag
    if (!language) {
      const languageResult = await p.select({
        message: "What type of smart contract did you write?",
        options: CONTRACT_TYPES.map((contract) => ({
          label: contract.label,
          value: contract.value,
          hint: contract.hint,
        })),
      });

      if (p.isCancel(languageResult)) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }

      language = languageResult as string;
    }

    const selectedContract = CONTRACT_TYPES.find(
      (contract) => contract.value === language,
    );

    if (!selectedContract) {
      p.log.error("Invalid contract type selected.");
      process.exit(1);
    }

    // Step 2: Network
    const chainResult = await p.select({
      message: selectedContract.networkMessage,
      options: selectedContract.networks,
    });

    if (p.isCancel(chainResult)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    const chain = chainResult as string;

    // Step 3: Contract address
    const addressResult = await p.text({
      message: "What is the contract address?",
      placeholder: "0x..",
      validate(value) {
        if (!value?.trim()) {
          return "Contract address is required";
        }

        return undefined;
      },
    });

    if (p.isCancel(addressResult)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    const address = addressResult as string;

    // Step 4: Project name
    const projectNameResult = await p.text({
      message: "What would you like to name this project?",
      placeholder: "w3docs",
      defaultValue: "w3docs",
    });

    if (p.isCancel(projectNameResult)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    let rawName = (projectNameResult as string)?.trim() || "w3docs";
    let targetDir: string;
    let displayName: string;

    if (rawName === "." || rawName === "./") {
      targetDir = process.cwd();
      displayName = path.basename(targetDir);
    } else {
      targetDir = path.resolve(process.cwd(), rawName);
      displayName = rawName;
    }

    const spinner = createSpinner();

    try {
      await scaffoldProject({
        targetDir,
        displayName,
        chain,
        address,
        verified: true,
        title: displayName,
        language: selectedContract?.label,
      });
    } catch (error: any) {
      spinner.stop("Failed");
      p.log.error(error.message);
      process.exit(1);
    }
  } catch (error: any) {
    p.outro(color.red(error.message));
    process.exit(1);
  }
}
