export interface W3DocsConfig {
  title: string;
  description: string;
  chain: string;
  address: string;
  verified: boolean;
  nav: { text: string; link: string }[];
  footer: { message: string; copyright: string };
}
