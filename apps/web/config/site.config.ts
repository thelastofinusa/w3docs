export const siteConfig = {
  name: "w3xp",
  slogan: "Explorer-first interfaces for smart contracts.",
  username: "thelastofinusa",
  nickname: "Holiday",
  description:
    "A CLI that turns deployed contracts into explorer-first interfaces with live reads, wallet-powered writes, and event timelines.",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://w3xp.vercel.app",
}
