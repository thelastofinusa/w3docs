"use client"
import React, { useEffect, useMemo, useState } from "react"
import { TerminalBlock } from "./terminal"

import { siteConfig } from "@/config/site.config"
import Image from "next/image"
import { imagePath } from "@typest/nextjs"
import { useTheme } from "next-themes"
import { FiMoon } from "react-icons/fi"
import { MdOutlineWbSunny } from "react-icons/md"
import { SiNpm } from "react-icons/si"
import Link from "next/link"
import { IoIosGitCommit } from "react-icons/io"
import { containerVariants } from "@/components/container"
import { Button, buttonVariants } from "@/components/ui/button"

type Stats = {
  downloads: string
  commits: number
  version: string
}

export const Hero = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  const [stats, setStats] = useState<Stats>({
    downloads: "0",
    commits: 0,
    version: "0.0.0",
  })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)

    async function loadStats() {
      try {
        const [downloadsRes, commitRes, versionRes] = await Promise.all([
          fetch("/api/downloads"),
          fetch("/api/commits"),
          fetch("/api/version"),
        ])

        const [downloadsData, commitData, versionData] = await Promise.all([
          downloadsRes.json(),
          commitRes.json(),
          versionRes.json(),
        ])

        setStats({
          downloads: downloadsData || "0",
          commits: commitData || 0,
          version: versionData || "0.0.0",
        })
      } catch {
        setStats({
          downloads: "0",
          commits: 0,
          version: "0.0.0",
        })
      }
    }

    loadStats()
  }, [])

  const links = useMemo(
    () => [
      {
        href: `https://www.npmjs.com/package/${siteConfig.name.toLowerCase()}`,
        icon: SiNpm,
        label: "Downloads",
        value: stats.downloads,
        iconClass: "size-4",
      },
      {
        href: `https://github.com/${siteConfig.username}/${siteConfig.name.toLowerCase()}`,
        icon: IoIosGitCommit,
        label: "Commits",
        value: stats.commits,
        iconClass: "size-5",
      },
    ],
    [stats]
  )

  return (
    <section
      className={containerVariants({
        size: "xs",
        className: "pt-24 pb-20",
      })}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src={imagePath("logo-white.png")}
            alt="Logo"
            width={16}
            height={16}
            className="hidden dark:block"
          />
          <Image
            src={imagePath("logo-black.png")}
            alt="Logo"
            width={16}
            height={16}
            className="dark:hidden"
          />
          <p className="font-mono text-xs font-medium text-muted-foreground">
            v{stats.version}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "px-1.5!",
              })}
            >
              <link.icon className={link.iconClass} />
              <span className="sr-only">{link.label}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                {link.value}
              </span>
            </Link>
          ))}
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {mounted ? (
              resolvedTheme === "dark" ? (
                <MdOutlineWbSunny className="size-4" />
              ) : (
                <FiMoon className="size-4" />
              )
            ) : (
              <div className="size-6 animate-pulse rounded-md bg-secondary" />
            )}
          </Button>
        </div>
      </div>
      <h1 className="mt-6 font-serif text-6xl leading-[0.95] tracking-tight text-foreground sm:text-7xl">
        {siteConfig.name}
      </h1>
      <p className="mt-6 max-w-xl text-sm text-muted-foreground sm:text-base">
        {siteConfig.description}
      </p>

      <div className="mt-10 space-y-3">
        <TerminalBlock label="Quick start" command="npx w3xp init" />
        <TerminalBlock
          label="Global install"
          command={"npm install -g w3xp\nw3xp init"}
        />
      </div>
    </section>
  )
}
