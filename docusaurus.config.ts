import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "VVsxmja's Blog",
  tagline: "Dinosaurs are cool",
  favicon: "img/favicon.ico",

  url: "https://vvsxmja.github.io/",
  baseUrl: "/blog/",

  organizationName: "VVsxmja",
  projectName: "blog",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  trailingSlash: false,

  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },

  presets: [
    [
      "classic",
      {
        docs: false,
        blog: {
          routeBasePath: "/",
          blogSidebarCount: 0,
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "VVsxmja's Blog",
      logo: {
        alt: "Logo",
        src: "img/logo.svg",
      },
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
