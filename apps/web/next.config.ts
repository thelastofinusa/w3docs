import type { NextConfig } from "next"
import { withTypedAssets } from "@typest/nextjs/plugin"

const nextConfig: NextConfig = {
  images: {
    qualities: [100, 75],
  },
}

export default withTypedAssets({ sources: [{ dir: "public" }] })(nextConfig)
