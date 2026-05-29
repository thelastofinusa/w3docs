import { SolidityContract, SolidityEvent, SolidityFunction } from "../types";

function generateFunctionDescription(
  inputs: { name: string; type: string }[],
  outputs: { type: string }[],
): string {
  const inputNames = inputs.map((i) => i.name || "param");
  const inputText = inputNames.length
    ? `Parameters: ${inputNames.join(", ")}`
    : "No parameters";
  const outputText = outputs.length
    ? ` → Returns: ${outputs.map((o) => o.type).join(", ")}`
    : "";
  return inputText + outputText;
}

function generateEventDescription(
  inputs: { name: string; type: string; indexed?: boolean }[],
): string {
  if (!inputs.length) return "No parameters";
  const names = inputs.map((i) => i.name || "param");
  let paramText: string = "";
  if (names.length === 1) paramText = names[0] || "param";
  else if (names.length === 2) paramText = `${names[0]} and ${names[1]}`;
  else
    paramText = `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
  return `Emits: ${paramText}`;
}

export function normaliseRawAbi(
  abi: any[],
  address: string,
  chainId: string,
  contractName = "Contract",
  devdoc?: any,
  userdoc?: any,
): { contract: SolidityContract; rawAbi: any[] } {
  const functions: SolidityFunction[] = [];
  const events: SolidityEvent[] = [];

  for (const item of abi) {
    if (item.type === "function") {
      const natspecDesc =
        devdoc?.methods?.[item.name]?.details ||
        userdoc?.methods?.[item.name]?.notice ||
        "";
      const inputs = (item.inputs || []).map((i: any, idx: number) => {
        const param: any = {
          name: i.name || `param${idx}`,
          type: i.type,
        };
        const paramDesc = devdoc?.methods?.[item.name]?.params?.[i.name];
        if (paramDesc) param.description = paramDesc;
        return param;
      });
      const outputs = (item.outputs || []).map((o: any) => ({ type: o.type }));

      functions.push({
        name: item.name,
        type:
          item.stateMutability === "view" || item.stateMutability === "pure"
            ? "read"
            : "write",
        description:
          natspecDesc || generateFunctionDescription(inputs, outputs),
        inputs,
        outputs,
        stateMutability: item.stateMutability,
      });
    } else if (item.type === "event") {
      const natspecDesc =
        devdoc?.events?.[item.name]?.details ||
        userdoc?.events?.[item.name]?.notice ||
        "";
      const inputs = (item.inputs || []).map((i: any) => ({
        name: i.name || "",
        type: i.type,
        indexed: i.indexed ?? false,
      }));

      events.push({
        name: item.name,
        signature: `${item.name}(${item.inputs.map((i: any) => i.type).join(",")})`,
        description: natspecDesc || generateEventDescription(inputs),
        inputs,
      });
    }
  }

  const contract: SolidityContract = {
    name: contractName,
    description:
      devdoc?.description ||
      userdoc?.description ||
      "Interactive documentation generated from the contract ABI.",
    address,
    network: chainId,
    verified: true,
    functions,
    events,
  };

  return { contract, rawAbi: abi };
}
