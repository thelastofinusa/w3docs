import { SOURCIFY_SERVER, formatAddress, getChainById } from "./utils"
import { normaliseRawAbi } from "./normalize"
import { SolidityContract } from "../types"

export async function fetchSolidityContract(
  chainId: string,
  address: string
): Promise<{ contract: SolidityContract; rawAbi: any[] }> {
  const url = `${SOURCIFY_SERVER}/v2/contract/${chainId}/${address}?fields=all`

  let response: Response
  const chain = getChainById(chainId)?.name || chainId

  try {
    response = await fetch(url)
  } catch {
    throw new Error(
      `Network error fetching contract ${formatAddress(address)} from ${chain}.`
    )
  }

  if (!response.ok) {
    let errorDetail = ""
    try {
      const errorBody = await response.text()
      if (errorBody) {
        const parsed = JSON.parse(errorBody)
        errorDetail = parsed.message || parsed.error || errorBody.slice(0, 200)
      } else {
        errorDetail = `HTTP ${response.status} ${response.statusText}`
      }
    } catch {}

    if (response.status === 404) {
      throw new Error(
        `No verified contract found for ${formatAddress(address)} on ${chain}.`
      )
    }
    throw new Error(errorDetail)
  }

  let data: any
  try {
    data = await response.json()
  } catch {
    throw new Error("Invalid response from metadata service.")
  }

  if (!data.abi?.length) {
    throw new Error(
      `No ABI found for ${formatAddress(address)} on ${chain}. Contract may be unverified.`
    )
  }

  return normaliseRawAbi(
    data.abi,
    address,
    chainId,
    data.compilation?.name || "Contract",
    data.devdoc,
    data.userdoc
  )
}
