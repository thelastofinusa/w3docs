import color from "chalk";
import * as p from "@clack/prompts";

import pkg from "../../package.json";
import { CONTRACT_TYPES } from "../lib/constants";
import { renderIntro } from "../lib/utils";

const { name } = pkg;

export default async function showChains() {
  renderIntro({
    badge: color.bgCyan(` ${name} `),
    title: "Available smart contract languages",
    iconColor: "cyanBright",
  });

  for (const contract of CONTRACT_TYPES) {
    const command = `npx w3docs init --${contract.value}`;

    const line = contract.available
      ? [
          `${color.cyan("◆")} ${color.bold(contract.label)} ${color.gray("→")} ${color.white(`${contract.hint}`)}`,
          `  ${color.white("Command:")} ${color.cyan(command)}`,
        ].join("\n")
      : [
          `${color.gray("◆")} ${color.bold(contract.label)} ${color.gray("→")} ${color.gray(`${contract.hint}`)} ${color.gray("(coming soon)")}`,
          `  ${color.white("Command:")} ${color.gray(command)}`,
        ].join("\n");

    p.log.message(line);
  }

  p.outro(
    `${color.white("Try it now")} ${color.gray("→")} ${color.cyan(" npx w3docs init --sol ")}`,
  );
}
