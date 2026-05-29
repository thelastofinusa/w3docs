import chalk from "chalk";
import { Command } from "commander";

import init from "./commands/init.command";
import { CONTRACT_TYPES } from "./lib/contracts";
import pkg from "../package.json" with { type: "json" };

const program = new Command();

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version, "-v, --version", "output the version number");

const initCommand = program
  .command("init")
  .description("initialize smart contract explorer");

// =========================
// CONTRACT TYPE FLAGS
// =========================
for (const contract of CONTRACT_TYPES) {
  initCommand.option(
    `--${contract.value}`,
    `generate explorer for ${chalk.blue(contract.label)} smart contract`,
  );
}

// =========================
// NETWORK + ADDRESS FLAGS
// =========================
initCommand.option(
  "-n, --network <network>",
  "network ID (e.g. 1 for Ethereum)",
);
initCommand.option(
  "-a, --address <address>",
  "deployed smart contract address",
);

initCommand.action(async (options) => {
  const selectedType = CONTRACT_TYPES.find(
    (contract) => options[contract.value],
  );

  const network = options.network;
  const address = options.address;

  console.clear();

  await init({
    type: selectedType?.value,
    network,
    address,
  });
});

process.argv.length <= 2 ? program.help() : program.parse();
