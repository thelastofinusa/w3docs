import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import figlet from "figlet";
import * as p from "@clack/prompts";

import {
  fetchSolidityContract,
  getChainById,
  validateAddress,
} from "@w3xp/core/solidity";
import { readFile } from "fs/promises";
import { InitCommandParams } from "../types";
import { scaffoldProject } from "../lib/scaffold";
import { CONTRACT_TYPES } from "../lib/contracts";
import pkg from "../../package.json" with { type: "json" };
import { createSpinner, renderIntro, sleep } from "../lib/utils";

export default async function init(param: InitCommandParams) {
  //! +++++++++++++++++++++++++++++++++++++++
  //! BANNER
  //! +++++++++++++++++++++++++++++++++++++++
  const banner = figlet.textSync(pkg.name, { font: "ANSI Shadow" });
  console.log(chalk.blue(banner));

  renderIntro({
    badge: `${chalk.bgBlue(` ${pkg.name} `)} v${pkg.version}`,
    title: pkg.description,
    iconColor: "blue",
  });

  //! +++++++++++++++++++++++++++++++++++++++
  //! CONTRACT TYPE SELECTION
  //! +++++++++++++++++++++++++++++++++++++++
  let typeFromFlag = !!param.type;
  let selectedType = param.type;

  if (!selectedType) {
    const result = await p.select({
      message: "Select contract type:",
      options: CONTRACT_TYPES.map((c) => ({
        label: c.label,
        value: c.value,
        hint: c.hint,
      })),
    });

    if (p.isCancel(result)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    selectedType = result;
  }

  const selectedTypeData = CONTRACT_TYPES.find((c) => c.value === selectedType);

  if (!selectedTypeData) {
    p.log.error("Invalid contract type selected.");
    p.outro(chalk.gray(`${pkg.name} exited.`));
    process.exit(1);
  }

  if (typeFromFlag) {
    p.log.step(`Type      → ${chalk.blueBright(selectedTypeData.label)}`);
  }

  if (!selectedTypeData.available) {
    p.outro(
      chalk.yellow(
        `Support for ${chalk.bold(selectedTypeData.label)} smart contract is under development.`,
      ),
    );
    process.exit(0);
  }

  //! +++++++++++++++++++++++++++++++++++++++
  //! NETWORK SELECTION
  //! +++++++++++++++++++++++++++++++++++++++
  let networkFromFlag = !!param.network;
  let selectedNetwork = param.network;

  if (!selectedNetwork) {
    const chainResult = await p.select({
      message: selectedTypeData.network.message,
      options: selectedTypeData.network.items,
      maxItems: 20,
    });

    if (p.isCancel(chainResult)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    selectedNetwork = chainResult as string;
  }

  if (selectedNetwork === "custom") {
    const customChainId = await p.text({
      message: "Enter EVM chain ID:",
      placeholder: "11155111",
      validate(value) {
        const num = Number(value);
        if (!value?.trim() || isNaN(num) || num <= 0) {
          return "Invalid chain ID";
        }
        return undefined;
      },
    });

    if (p.isCancel(customChainId)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    selectedNetwork = customChainId as string;
  }

  if (networkFromFlag) {
    p.log.step(
      `Network   → ${chalk.blueBright(getChainById(selectedNetwork)?.name ?? selectedNetwork)}`,
    );
  }

  //! +++++++++++++++++++++++++++++++++++++++
  //! CONTRACT ADDRESS
  //! +++++++++++++++++++++++++++++++++++++++
  let addressFromFlag = !!param.address;
  let selectedAddress = param.address;

  if (!selectedAddress) {
    const addressResult = await p.text({
      message: "Enter contract address:",
      placeholder: "0x...",
      validate(value) {
        return validateAddress(value as string);
      },
    });

    if (p.isCancel(addressResult)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    selectedAddress = addressResult as string;
  }

  if (addressFromFlag) {
    p.log.step(`Address   → ${chalk.blueBright(selectedAddress)}`);
  }

  //! +++++++++++++++++++++++++++++++++++++++
  //! DIRECTORY SETUP
  //! +++++++++++++++++++++++++++++++++++++++
  const projectNameResult = await p.text({
    message: "Which directory should we create the project in?",
    placeholder: `${pkg.name}-app`,
    defaultValue: pkg.name,
  });

  if (p.isCancel(projectNameResult)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  let rawName = (projectNameResult as string).trim();

  const resolveDir = (name: string) => {
    if (name === "." || name === "./") {
      return {
        targetDir: process.cwd(),
        displayName: path.basename(process.cwd()),
      };
    }

    return {
      targetDir: path.resolve(process.cwd(), name),
      displayName: name,
    };
  };

  let { targetDir, displayName } = resolveDir(rawName);

  //! +++++++++++++++++++++++++++++++++++++++
  //! DIRECTORY CONFLICT HANDLING
  //! +++++++++++++++++++++++++++++++++++++++
  while (fs.existsSync(targetDir)) {
    const isCurrentDir = targetDir === process.cwd();

    const action = await p.select({
      message: `Directory ${chalk.bgRed(
        ` ${displayName} `,
      )} already exists. What next?`,
      options: [
        ...(!isCurrentDir ? [{ label: "Overwrite", value: "overwrite" }] : []),
        { label: "Rename", value: "rename" },
        { label: "Cancel", value: "cancel" },
      ],
    });

    if (p.isCancel(action) || action === "cancel") {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    if (action === "overwrite") {
      fs.removeSync(targetDir);
      break;
    }

    if (action === "rename") {
      const newName = await p.text({
        message: "New directory name:",
        validate: (v) => (v?.trim() ? undefined : "Name is required"),
      });

      if (p.isCancel(newName)) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }

      rawName = newName as string;
      const resolved = resolveDir(rawName);

      targetDir = resolved.targetDir;
      displayName = resolved.displayName;
    }
  }

  //! +++++++++++++++++++++++++++++++++++++++
  //! FETCH CONTRACT (WITH RETRY LOOP)
  //! +++++++++++++++++++++++++++++++++++++++
  let contractData: string | undefined;
  let rawAbi: string | undefined;
  let contractName = displayName;

  let retryFetch = true;

  while (retryFetch) {
    retryFetch = false;

    const spinner = createSpinner();
    spinner.start(chalk.blue("Fetching contract metadata"));

    try {
      const result = await fetchSolidityContract(
        selectedNetwork,
        selectedAddress,
      );

      contractData = JSON.stringify(result.contract, null, 2);
      rawAbi = JSON.stringify(result.rawAbi, null, 2);
      contractName = result.contract.name;

      spinner.message(
        chalk.blue(`Detected ${chalk.bold(contractName)} → syncing metadata`),
      );
      await sleep(3500);

      spinner.stop(chalk.green("Contract metadata retrieved"));
    } catch (error) {
      spinner.error(
        chalk.red(
          error instanceof Error
            ? error.message
            : "Failed to fetch contract metadata",
        ),
      );

      const action = await p.select({
        message: "Fetch failed. What would you like to do?",
        options: [
          {
            label: "Retry",
            value: "retry",
            hint: "Try fetching again",
          },
          {
            label: "Use sample data",
            value: "sample",
            hint: "Generate docs with demo content",
          },
          {
            label: "Provide custom ABI",
            value: "custom",
            hint: "Use your own ABI file",
          },
          { label: "Cancel", value: "cancel" },
        ],
      });

      if (p.isCancel(action) || action === "cancel") {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }

      if (action === "retry") {
        retryFetch = true;
        continue;
      }

      if (action === "sample") {
        p.log.warn("Using sample contract data");
        break;
      }

      if (action === "custom") {
        const filePath = await p.text({
          message: "ABI file path:",
          placeholder: "./abi.json",
        });

        if (p.isCancel(filePath)) {
          p.cancel("Operation cancelled.");
          process.exit(0);
        }

        try {
          rawAbi = await readFile(filePath as string, "utf-8");

          contractData = JSON.stringify(
            {
              name: contractName,
              address: selectedAddress,
              network: selectedNetwork,
              verified: false,
              description: "Custom ABI contract",
            },
            null,
            2,
          );

          p.log.success("Custom ABI loaded.");
        } catch {
          p.log.error("Failed to read ABI file.");
          process.exit(1);
        }
      }
    }
  }

  //! +++++++++++++++++++++++++++++++++++++++
  //! SCAFFOLD PROJECT
  //! +++++++++++++++++++++++++++++++++++++++
  try {
    await scaffoldProject({
      targetDir,
      displayName,
      network: selectedNetwork,
      address: selectedAddress,
      verified: true,
      title: contractName,
      contractData,
      rawAbi,
    });
  } catch (error: any) {
    p.log.error(chalk.red("Failed to scaffold project"));
    p.outro(chalk.red(error.message));
    process.exit(1);
  }
}
