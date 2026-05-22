import { create } from "zustand"
import type { Chain, TabKey } from "@/lib/abi"

interface UIState {
  activeTab: TabKey
  searchQuery: string
  chain: Chain
  setActiveTab: (tab: TabKey) => void
  setSearchQuery: (query: string) => void
  setChain: (chain: Chain) => void
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: "read",
  searchQuery: "",
  chain: "Ethereum",
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setChain: (chain) => set({ chain }),
}))
