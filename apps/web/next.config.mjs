import { withTypedAssets } from "@typest/nextjs/plugin"

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withTypedAssets({
  sources: [{ dir: "public" }],
})(nextConfig)
