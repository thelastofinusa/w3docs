import { withTypedAssets } from "@typest/nextjs/plugin"

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [100, 75],
  },
}

export default withTypedAssets({
  sources: [{ dir: "public" }],
})(nextConfig)
