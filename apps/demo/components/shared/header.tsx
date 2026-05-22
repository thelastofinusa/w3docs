"use client"
import Link from "next/link"
import Image from "next/image"
import { Icons } from "hugeicons-proxy"
import { imagePath } from "@typest/nextjs"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Container } from "./container"
import { siteConfig } from "@/config/site.config"
import { useUIStore } from "@/store"
import { Chain, CHAINS } from "@/lib/abi"

export const Header = () => {
  const { searchQuery, setSearchQuery, chain, setChain } = useUIStore()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-18 items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium tracking-tight"
        >
          <Image
            src={imagePath("logo-white.png")}
            alt={siteConfig.name}
            width={22}
            height={22}
            quality={100}
            priority
          />
          <span>w3docs</span>
        </Link>

        <InputGroup className="mx-auto hidden w-full max-w-md md:flex">
          <InputGroupInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search functions, events, types..."
          />
          <InputGroupAddon>
            <Icons.Search01Icon />
          </InputGroupAddon>
        </InputGroup>

        <div className="relative ml-auto">
          <Select>
            <SelectTrigger
              value={chain}
              onChange={(e) => setChain(e.target.value as Chain)}
              className="w-32"
            >
              <SelectValue placeholder="Ethereum" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {CHAINS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Container>
      <div className="px-4 pb-3 md:hidden">
        <InputGroup>
          <InputGroupInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search functions, events, types..."
          />
          <InputGroupAddon>
            <Icons.Search01Icon />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </header>
  )
}
