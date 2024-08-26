---
title: Docusaurus 初体验！
authors:
  - me
---

这个框架的名字好难背呀……但是小恐龙的图标很可爱。

![Docusaurus Introducing](./slash-introducing.svg)

<!-- truncate -->

---

很早就有写博客的想法，但是一直没找到一个很对我胃口的框架。因为除了写博客这件事之外，我还希望能够大力魔改我用的博客框架。

——要开箱即用，又要高可玩性，还要详细的文档，如果能方便地用 JavaScript/TypeScript 添加自己想要的功能，用 CSS 改成自己喜欢的样式，就最好了。

之前用过一段时间的 [Mkdocs](https://www.mkdocs.org/) 和 [Hexo](https://hexo.io/) ，它们都是很出色的框架，使用体验也很好，但就是不太能满足我的定制化需求：它们的插件系统要不就是用起来很麻烦，要不就是缺少文档。

后来用了一段时间的 [VitePress](https://vitepress.dev/) ，当时以为自己找到了**命中注定的那个框架**：基于 Vue 和 Vite ，极高的可定制性；框架本身也并不复杂，代码不多，很快就能看完。我甚至写了[一个 VitePress 的主题](https://github.com/VVsxmja/vitepress-theme-blog-pure)。

## VitePress 之旅

VitePress 的可定制性太强了！强的原因是 VitePress 本身的功能并不多。

它只做这么几件事：把 Markdown 用 [markdown-it](https://github.com/markdown-it/markdown-it) 和 [mdit-vue](https://github.com/mdit-vue/mdit-vue) 翻译成 HTML ，处理一下各个文件之间的链接，然后[嵌入到默认/自定义 Layout 中的 `<Content />`元素里](https://vitepress.dev/reference/runtime-api#content)，基本上就大功告成了。

而自定义 Layout 更是 100% Hackable 的逆天存在，[它就是一个 Vue Component](https://vitepress.dev/guide/custom-theme#building-a-layout)（顺便一提，[VitePress 的 Markdown 中也支持插入 Vue Component](https://vitepress.dev/guide/using-vue)），可以在运行时做自己想做的任何的事情。

在构建期间也可以通过自定义的 [Build-Time Data Loader](https://vitepress.dev/guide/data-loading) 构建出任意的自定义数据，例如博客框架里常用的[博文列表](https://github.com/VVsxmja/vitepress-theme-blog-pure/blob/main/.vitepress/theme/posts.data.ts)（一般会加上分页），[各篇文章的编辑日期和修改日期](https://github.com/VVsxmja/vitepress-theme-blog-pure/blob/main/.vitepress/theme/timestamp.data.ts)，以及各种其他的好玩的东西……

后来放弃 VitePress 的原因有两个，一个是 VitePress 的文档太弱了，另一个是 VitePress 和 Vite 强绑定，但是 Vite 太难懂了（而且文档也比较弱）。为了把我的自定义主题导出成 npm 包，费了九牛二虎之力都没有成功，最后只好作罢。

> 其实我大概知道问题在哪：因为我用了 [UnoCSS](https://unocss.dev/) 的 [Vite 集成](https://unocss.dev/integrations/vite)，所以除了用 npm 包分发代码之外，用户还需要额外进行 [VitePress 的 Vite 配置](https://vitepress.dev/reference/site-config#vite)，但我自己用新的环境尝试了几次，遇到了各种难以描述的奇怪的错误……总之失败了几次之后彻底失去耐心了.

我很热衷于自己造轮子，事实上造这个 VitePress 主题的过程中我已经造出了一个博客框架大部分必要的组成部分了。但是碰到奇怪的问题又找不到文档时，那种挫败感真的令人难受。

## 图标是一个小恐龙的静态站点框架

放弃 VitePress 之后决定寻找一个新的框架，网上冲浪了一段时间之后发现了 [Docusaurus](https://docusaurus.io/) 这个好东西。基于 React ，文档非常详细（Docusaurus 的官网本身就是使用 Docusaurus 写的文档博客二合一网站），有[开箱即用的博客框架](https://docusaurus.io/docs/blog)，并且也支持定制化，而且[这个定制的方式还很神奇](https://docusaurus.io/docs/swizzling)……总之被圈粉了。

这个小恐龙的图标真的很魔性，越看越喜欢。

![Docusaurus](./docusaurus.svg)
![Docusaurus Keytar](./docusaurus_keytar.svg)
![Docusaurus Speed](./docusaurus_speed.svg)

简单上手了一下，使用体验非常好：文档很丰富，甚至[连 Frontmatter 都有文档](https://docusaurus.io/docs/markdown-features#front-matter)。

大悦，遂撰文记之。于是就有了您现在正在看的这篇文章以及这个网站。
