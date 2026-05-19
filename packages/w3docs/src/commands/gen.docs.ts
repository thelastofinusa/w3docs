import kleur from "kleur";
import * as p from "@clack/prompts";
import { CONTRACT_TYPES } from "../lib/constants";
import { sleep } from "../lib/utils";

export default async function generateDocs() {
  console.clear();

  p.intro(
    `${kleur.cyan("w3docs")} ${kleur.gray("interactive smart contract documentation")}`,
  );

  // Step 1: Contract type
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

  const language = languageResult as string;

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
    placeholder: "0x...",
    initialValue: "0xdac17f958d2ee523a2206206994597c13d831ec7", // TODO: DELETE THIS
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
    placeholder: `contract-docs-${address.slice(2, 8)}`,
    initialValue: "erc20-contract", // TODO: DELETE THIS
    validate(value) {
      if (!value?.trim()) {
        return "Project name is required";
      }

      if (!/^[a-z0-9-_]+$/.test(value)) {
        return "Use lowercase letters, numbers, hyphens, or underscores only";
      }

      return undefined;
    },
  });

  if (p.isCancel(projectNameResult)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const projectName =
    (projectNameResult as string) || `contract-docs-${address.slice(2, 8)}`;

  // Processing
  const spinner = p.spinner();

  spinner.start("Fetching contract interface...");
  await sleep(1500);

  spinner.message("Generating documentation...");
  await sleep(1200);

  spinner.message("Scaffolding project...");
  await sleep(800);

  spinner.message("Installing dependencies...");
  await sleep(2000);

  spinner.stop("Project generated successfully.");

  // Summary
  p.note(
    [
      `${kleur.bold("Language")}  ${kleur.gray("→")} ${language}`,
      `${kleur.bold("Network")}   ${kleur.gray("→")} ${chain}`,
      `${kleur.bold("Address")}   ${kleur.gray("→")} ${address}`,
      `${kleur.bold("Project")}   ${kleur.gray("→")} ${projectName}`,
    ].join("\n"),
    "Configuration",
  );

  p.outro(
    [
      `${kleur.green("Project created at")} ./${projectName}`,
      "",
      `${kleur.bold("Next steps")}`,
      `  cd ${projectName}`,
      `  w3docs serve`,
      "",
      `${kleur.gray("Generated project includes:")}`,
      `  • Documentation landing page`,
      `  • Interactive contract explorer`,
      `  • Ready-to-deploy project structure`,
    ].join("\n"),
  );
}
