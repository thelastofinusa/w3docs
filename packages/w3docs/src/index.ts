#!/usr/bin/env node

import * as p from "@clack/prompts";
import { Command } from "commander";

import pkg from "../package.json";
import generateDocs from "./commands/gen.docs";

const { name, version, description } = pkg;

const program = new Command();

program.name(name).description(description).version(version);

program
  .command("generate")
  .description("Generate smart contract documentation")
  .action(async () => generateDocs());

if (process.argv.length <= 2) {
  generateDocs().catch((error) => {
    p.log.error(String(error));
    process.exit(1);
  });
} else {
  program.parse();
}
