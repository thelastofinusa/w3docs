import Link from "next/link"
import Image from "next/image"
import { Icons } from "hugeicons-proxy"
import { imagePath } from "@typest/nextjs"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Container } from "./container"
import { siteConfig } from "@/config/site.config"
import { Button } from "../ui/button"

export const Header = () => {
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
          <InputGroupInput placeholder="Search functions, events, types..." />
          <InputGroupAddon>
            <Icons.Search01Icon />
          </InputGroupAddon>
        </InputGroup>

        <div className="relative ml-auto">
          <Button variant="outline">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="font-medium">Ethereum</span>
            <Icons.ArrowDown01Icon className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </Container>

      <div className="px-4 pb-3 md:hidden">
        <InputGroup>
          <InputGroupInput placeholder="Search functions, events, types..." />
          <InputGroupAddon>
            <Icons.Search01Icon />
          </InputGroupAddon>
        </InputGroup>
      </div>
    </header>
  )
}
