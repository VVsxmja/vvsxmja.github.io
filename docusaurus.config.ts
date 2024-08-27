import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "VVsxmja's Blog",
  favicon: "img/favicon.ico",

  url: process.env.URL ?? "http://localhost",
  baseUrl: process.env.BASE_URL ?? "/",

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
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "VVsxmja's Blog",
      logo: {
        alt: "Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          href: "https://github.com/VVsxmja/vvsxmja.github.io",
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        }
      ]
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
