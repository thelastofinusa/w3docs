import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const containerVariants = cva("mx-auto w-full px-5 sm:px-6", {
  variants: {
    size: {
      default: "max-w-7xl",
      sm: "max-w-3xl",
      xs: "max-w-2xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function Container({
  className,
  size,
  ...props
}: React.ComponentProps<"section"> & VariantProps<typeof containerVariants>) {
  return (
    <section
      data-slot="section"
      className={cn(containerVariants({ size, className }))}
      {...props}
    />
  )
}

export { Container, containerVariants }
