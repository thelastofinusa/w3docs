import { siteConfig } from "@/config/site.config"
import { containerVariants } from "@/components/container"

export const Footer = () => {
  return (
    <footer
      className={containerVariants({
        size: "xs",
        className: "flex items-center justify-center py-10",
      })}
    >
      <span className="block text-center text-sm text-muted-foreground">
        © {2026} {siteConfig.name}, All rights reserved
      </span>
    </footer>
  )
}
