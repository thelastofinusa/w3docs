// 0x1B76Fa05C76fB0B482C408c3380CD403a73a7E28
// 11155420
import path from "path"
import chalk from "chalk"
import fs from "fs-extra"
import figlet from "figlet"
import * as p from "@clack/prompts"
import { fetchEVMContract, fetchEVMContractByChainId } from "@w3docs/core/evm"
import { CONTRACT_TYPES } from "../lib/constants"
import { scaffoldProject } from "../lib/scaffold"
import { createSpinner, renderIntro } from "../lib/utils"
import pkg from "../../package.json" with { type: "json" }

const { name, description } = pkg

export default async function generateDocs(initialLanguage?: string) {
  const banner = figlet.textSync(name, { font: "ANSI Shadow" })
  console.log(chalk.cyan(banner))

  try {
    renderIntro({
      badge: `Welcome to ${chalk.bgCyan(` ${name} `)}`,
      title: description,
      iconColor: "cyan",
    })

    let language = initialLanguage

    // Skip language selection if passed via CLI flag
    if (!language) {
      const languageResult = await p.select({
        message: "What type of smart contract did you write?",
        options: CONTRACT_TYPES.map((contract) => ({
          label: contract.label,
          value: contract.value,
          hint: contract.hint,
        })),
      })

      if (p.isCancel(languageResult)) {
        p.cancel("Operation cancelled.")
        process.exit(0)
      }

      language = languageResult as string
    }

    const selectedContract = CONTRACT_TYPES.find(
      (contract) => contract.value === language
    )

    if (!selectedContract) {
      p.log.error("Invalid contract type selected.")
      process.exit(1)
    }

    // Step 2: Network
    const chainResult = await p.select({
      message: selectedContract.networkMessage,
      options: selectedContract.networks,
      maxItems: 10,
    })

    if (p.isCancel(chainResult)) {
      p.cancel("Operation cancelled.")
      process.exit(0)
    }

    let chain = chainResult as string

    // If user chose "Custom", ask for the chain ID
    if (chain === "custom") {
      const customChainId = await p.text({
        message: "Enter the EVM chain ID (e.g., 137 for Polygon):",
        placeholder: "137",
        validate(value) {
          const num = Number(value)
          if (!value?.trim() || isNaN(num) || num <= 0)
            return "Please enter a valid positive chain ID"
          return undefined
        },
      })

      if (p.isCancel(customChainId)) {
        p.cancel("Operation cancelled.")
        process.exit(0)
      }

      chain = (customChainId as string).trim()
    }

    // Step 3: Contract address
    const addressResult = await p.text({
      message: "What is the contract address?",
      placeholder: "0x..",
      validate(value) {
        if (!value?.trim()) return "Contract address is required"
        return undefined
      },
    })

    if (p.isCancel(addressResult)) {
      p.cancel("Operation cancelled.")
      process.exit(0)
    }

    const address = addressResult as string

    // Step 4: Project name
    const projectNameResult = await p.text({
      message: "What would you like to name this project?",
      placeholder: "w3docs",
      defaultValue: "w3docs",
    })

    if (p.isCancel(projectNameResult)) {
      p.cancel("Operation cancelled.")
      process.exit(0)
    }

    // Step 4: Project name
    let rawName = (projectNameResult as string)?.trim() || "w3docs"
    let targetDir: string
    let displayName: string

    // Resolve the initial target
    const resolveDir = (name: string) => {
      if (name === "." || name === "./") {
        return {
          targetDir: process.cwd(),
          displayName: path.basename(process.cwd()),
        }
      }
      return {
        targetDir: path.resolve(process.cwd(), name),
        displayName: name,
      }
    }

    ;({ targetDir, displayName } = resolveDir(rawName))

    // Conflict resolution loop
    while (fs.existsSync(targetDir)) {
      // When targetDir is the current directory, check if it's empty
      if (targetDir === process.cwd()) {
        const files = fs.readdirSync(targetDir).filter(
          (f) => !f.startsWith(".") // ignore all dotfiles
        )
        if (files.length === 0) break // empty dir – fine to use
      }

      const isCurrentDir = targetDir === process.cwd()

      const action = await p.select({
        message: `Directory ${chalk.redBright(displayName)} already exists. What would you like to do?`,
        options: [
          ...(isCurrentDir
            ? []
            : [
                {
                  label: "Overwrite",
                  value: "overwrite",
                  hint: "delete and recreate",
                },
              ]),
          { label: "Rename", value: "rename", hint: "choose a new name" },
          { label: "Cancel", value: "cancel", hint: "exit without changes" },
        ],
      })

      if (p.isCancel(action) || action === "cancel") {
        p.cancel("Operation cancelled.")
        process.exit(0)
      }

      if (action === "overwrite") {
        fs.removeSync(targetDir)
        break // directory no longer exists, proceed
      }

      if (action === "rename") {
        const newName = await p.text({
          message: "Enter a new project name:",
          placeholder: "w3docs",
          validate(value) {
            if (!value?.trim()) return "Project name is required"
            return undefined
          },
        })

        if (p.isCancel(newName)) {
          p.cancel("Operation cancelled.")
          process.exit(0)
        }

        rawName = (newName as string).trim() || "w3docs"
        const resolved = resolveDir(rawName)
        targetDir = resolved.targetDir
        displayName = resolved.displayName
        // Loop continues – it will check the new directory
      }
    }

    // Now targetDir either didn't exist or has been cleared

    // -------- Fetch contract data (Sourcify only) --------
    const spinner = createSpinner()

    let contractData: string | undefined
    let rawAbi: string | undefined
    let contractName = displayName
    let contractDescription =
      "Interactive documentation generated from the contract ABI. Inspect read methods, simulate writes, and listen to events — all from one place."

    const isCustomChain = !isNaN(Number(chain))

    spinner.start(chalk.cyan("Resolving contract metadata"))
    try {
      const result = isCustomChain
        ? await fetchEVMContractByChainId(Number(chain), address)
        : await fetchEVMContract(chain, address)

      contractData = JSON.stringify(result.contract, null, 2)
      rawAbi = JSON.stringify(result.rawAbi, null, 2)
      contractName = result.contract.name
      contractDescription = result.contract.description || ""

      spinner.stop(chalk.green("Contract metadata resolved"))
    } catch (error: any) {
      spinner.stop(chalk.red("Unable to resolve contract metadata"))
      p.log.error(error.message)

      const useSample = await p.confirm({
        message: "No verified ABI found. Use sample data instead?",
      })

      if (!useSample) {
        p.log.error(chalk.red("Aborting. Verify the contract and try again."))
        process.exit(1)
      }

      p.log.warn(
        chalk.yellow(
          "Using sample contract data. The explorer will display demo content."
        )
      )
    }

    // ----- Ask for a description -----
    const userDescription = await p.text({
      message: "What is this contract about? (short description)",
      placeholder: "A simple counter contract",
      defaultValue: contractDescription,
    })

    if (!p.isCancel(userDescription)) {
      const desc = (userDescription as string)?.trim() || contractDescription
      contractDescription = desc

      // Embed description into contractData if we have real data
      if (contractData) {
        const parsed = JSON.parse(contractData)
        parsed.description = desc
        contractData = JSON.stringify(parsed, null, 2)
      }
    }

    // -------- Scaffold the project --------
    try {
      await scaffoldProject({
        targetDir,
        displayName,
        chain,
        address,
        verified: true,
        title: contractName,
        language: selectedContract?.label,
        spinner,
        contractData,
        rawAbi,
        description: contractDescription, // pass description for sample fallback
      })
    } catch (error: any) {
      spinner.stop(chalk.red("Failed"))
      p.log.error(error.message)
      process.exit(1)
    }
  } catch (error: any) {
    p.outro(chalk.red(error.message))
    process.exit(1)
  }
}
