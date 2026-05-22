export const siteConfig = {
  name: "w3docs",
  slogan: "Documentation for the on-chain world",
  username: "thelastofinusa",
  nickname: "Holiday",
  description:
    "w3docs is a CLI tool that turns deployed smart contracts into beautiful, interactive documentation websites.",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://w3docs.vercel.app",
}
