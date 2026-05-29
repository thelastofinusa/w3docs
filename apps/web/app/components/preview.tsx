import React from "react"
import Image from "next/image"
import { imagePath } from "@typest/nextjs"
import { containerVariants } from "@/components/container"

export const ProductPreview = () => {
  return (
    <section
      className={containerVariants({
        size: "sm",
        className: "px-0! pt-24 pb-20",
      })}
    >
      <div className={containerVariants({ size: "xs" })}>
        <h2 className="mt-4 max-w-sm font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
          From contract address to interface
        </h2>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
          Point w3xp at a deployed contract address and generate an
          explorer-first app with typed read/write panels, event views, and ABI
          context.
        </p>
      </div>

      <div className="mt-10 px-5 sm:mt-12 sm:px-6">
        <div className="relative -mr-56 overflow-hidden rounded-lg border mask-b-from-55% sm:mr-0">
          <div className="relative flex items-center justify-center border-b bg-card p-1.5">
            <div className="absolute left-3 flex items-center gap-1">
              <span className="size-2 rounded-full bg-destructive" />
              <span className="size-2 rounded-full bg-yellow-400" />
              <span className="size-2 rounded-full bg-green-400" />
            </div>

            <div className="flex w-full max-w-sm items-center justify-center rounded-md bg-secondary px-3 py-0.5">
              <p className="text-[11px] font-medium text-muted-foreground">
                https://www.example.com
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <Image
              src={imagePath("hero-light.png")}
              alt="preview"
              width={950}
              height={550}
              className="object-cover dark:hidden"
              loading="eager"
            />
            <Image
              src={imagePath("hero-dark.png")}
              alt="preview"
              width={950}
              height={550}
              className="hidden object-cover dark:block"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
