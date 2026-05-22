import Image from "next/image"
import { imagePath } from "@typest/nextjs"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site.config"

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <Image
            src={imagePath("logo-black.png")}
            alt={siteConfig.name}
            width={32}
            height={32}
            quality={100}
            priority
            className="block dark:hidden"
          />
          <Image
            src={imagePath("logo-white.png")}
            alt={siteConfig.name}
            width={32}
            height={32}
            quality={100}
            priority
            className="hidden dark:block"
          />
          <h1 className="mt-2 font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          [ Press <kbd>d</kbd> to toggle dark mode ]
        </div>
      </div>
    </div>
  )
}
