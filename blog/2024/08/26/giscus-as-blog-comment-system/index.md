---
title: 用 Giscus 给 Docusaurus 博客增加评论区
authors:
  - me
---

从 GitHub 中来，到 GitHub 中去。

{/* truncate */}

---

## 选择 Giscus 的原因

其实没啥可选的……

- 我希望这个评论插件可以基于 GitHub 来做，因为懒得在 GitHub 之外再弄一套管理评论的东西了。
- 基于 GitHub 的评论插件，（基本上）要么是通过 Issues ，要么是通过 Discussions 。
- 我更倾向于用 Discussions 来做评论区，Issues 用来做别的事。
- 使用 Discussions 的评论插件，几乎只有 Giscus 。
  - 我 Google 了 `github discussion comment system -giscus` ，搜索结果里面都是乱七八糟的东西，找不到第二个像 Giscus 一样的插件。

## 如果您没有听说过 Giscus

[Giscus](https://github.com/giscus/giscus) 是一个基于 GitHub Discussion 的评论系统。而 [`giscus.app`](https://giscus.app/) 是 Giscus 的文档兼脚本生成器。

跟随 [`giscus.app`](https://giscus.app/) 上的指引，我们最终会得到一个 HTML 元素，将这个元素插入到网页源代码中，Giscus 就出现啦。

如果您不喜欢直接写 HTML 元素，或者正在使用某个前端框架，您也可以使用 [Giscus Component](https://github.com/giscus/giscus-component) 。比如您现在正在看的这个博客使用的框架是 [Docusaurus](https://docusaurus.io/) ，而这个框架是基于 [React](https://react.dev/) 的，所以我使用了 [`@giscus/react`](https://github.com/giscus/giscus-component/tree/main/react) 。

所以我们总共需要做三件事：

1. 在 GitHub 上的，我们的博客仓库中，[启用 Discussions](https://docs.github.com/en/github/administering-a-repository/managing-repository-settings/enabling-or-disabling-github-discussions-for-a-repository) ，并且（可选）创建一个 Giscus 专属的 Discussion Category 来将 Giscus 发布的内容与其他内容区分开。这个 Category 最好是 Announcement 类型的（其中的内容只能由仓库维护者和 Giscus 创建）。
2. 使用 [`giscus.app`](https://giscus.app/) 来为我们在 GitHub 上的博客仓库生成一个对应的评论区 HTML 元素代码；
3. 把这个 HTML 代码翻译成对应的 [Giscus Component](https://github.com/giscus/giscus-component) ，嵌入我们的博客中。

## Giscus 的配置该怎么选

[`giscus.app`](https://giscus.app/) 上对于每个配置项都有详细的描述，这里就不全部展开了，挑重点说。

### 页面和 Discussion 的对应关系

我选择的是 URL ，原因是我的博客可能有多份部署（比如 PR Preview 部署在 Vercel 上），而我希望将不同部署之间的评论区互相隔离。

在 Giscus 提供的选项中，只有 URL 恰好支持了这个需求。不过代价是 GitHub Discussion 的标题会是 Blog Post 的 URL 而不是标题，在 GitHub 里面看起来比较丑（不过又有谁会在 GitHub 中查看博客的评论区，而不是直接在博客中查看呢）。

### 主题

这个选项改动之后，在页面下方可以看到实时预览。

我们的博客目前有明亮和暗黑两种颜色模式，我们希望读者切换 Docusaurus 的日夜模式后，Giscus 也能切换到对应的主题。

实现这个功能的方法下文会描述，这里我们先尝试下所有选项，分别为明亮和暗黑模式找到对应的合适的主题，然后记住下面代码中的 `theme` ，等下要用。

## 在 Docusaurus 中嵌入我们的评论区组件

[Giscus Component 的文档](https://github.com/giscus/giscus-component#documentation)详细描述了将 HTML 元素翻译成对应组件的方法。

对照着文档和上面生成的 HTML 元素代码填空之后，我们得到了一个 Giscus React 组件：

```tsx
import Giscus from '@giscus/react';

const GiscusContainer = (
  <Giscus
    {/* ...... */}
    mapping="url"
    theme={/* light or dark_dimmed */}
  />
);
```

接下来要做的事情就是将这个组件插入到 Docusaurus 中。如果您也在使用 Docusaurus ，并且对于魔改 Docusaurus 组件的方法并不熟悉，您可以参考 [Docusaurus 官方魔改教程](https://docusaurus.io/docs/swizzling)。

Docusaurus 提供了两种魔改的方式：Ejecting 和 Wrapping 。简单来说就是：

- Ejecting ：将 Docusaurus 某个组件的代码复制一份，开发者在其上进行修改。这是真正的魔改，自由度最高，但缺点是大量的组件代码被复制出来，会造成代码仓库体积的膨胀。
- Wrapping ：在 Docusaurus 某个组件的外层创建一个 Wrapper ，比较优雅。大部分时候 Wrapping 就够用了。

这里，我们希望在博客页面的下方添加我们的评论区组件，所以我们可以 Wrap 展示「博客内容」的组件，在博客内容的下方加上 Giscus 的代码。

我们使用的是 Docusaurus 默认的博客插件，需要 Wrap `@docusaurus/theme-classic` 这个主题的 `BlogPostItem` 组件。

```sh
# 以 npm 为例
npm run -- docusaurus swizzle @docusaurus/theme-classic BlogPostItem --wrap
```

项目根目录中会出现这些文件：

```
src
└── theme
    └── BlogPostItem
        └── index.tsx
```

打开 `src/theme/BlogPostItem/index.tsx` ，在 `BlogPostItem` 之后添加我们的 Giscus React 组件，打开我们的 Docusaurus 本地预览，我们就能看到博文下方的评论区啦！

然而预览之后会发现，博文下方确实出现了评论区，但是首页（博文目录）的每一个摘要下方也出现了评论区…… 🤡

### 限制 Giscus 只在具体博文下方显示

Docusaurus 默认主题提供了一个 Internal API 叫做 `useBlogPost()` ，可以用来查询当前页面属于博文目录还是具体的博文页面。

因为是 Internal API ，所以文档里面没有关于这个 API 的描述 🤡 ，我在 Docusaurus 的 GitHub Repo 里面搜罗了一圈才找到相关的内容：

- https://github.com/facebook/docusaurus/discussions/8140
- https://github.com/facebook/docusaurus/pull/8088/files
- https://github.com/facebook/docusaurus/pull/10316

我们通过这个 API 来拿到当前页面所属的类别，并在此基础上控制 Giscus 的显示：

```tsx
// other imports......
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';

export default function BlogPostItemWrapper(props: Props): JSX.Element {
  const { isBlogPostPage } = useBlogPost();
  const GiscusContainer = (
    <Giscus
      {/* ...... */}
    />
  );
  return (
    <>
      <BlogPostItem {...props} />
      {/* Prevent giscus to show up on blog post menu */}
      {isBlogPostPage && GiscusContainer}
    </>
  );
}
```

再次打开预览，此时的 Giscus 应该仅在博文页面显示。我们也可以尝试写一些评论，会发现 GitHub 中出现了标题为 `http://localhost:3000/......` 的 Discussions ，符合预期。接下来只需要加上我们的日夜模式切换功能，就大功告成啦。

### 根据当前颜色模式切换 Giscus Theme

> 这个方法比较省力。这个博客（20240826）使用的也是这个方法。下文还会介绍一种可能更加优雅的方法。

Docusaurus 提供了 `useColorMode()` 来获取当前读者选择的颜色模式。

[这个 API 的文档](https://docusaurus.io/docs/api/themes/configuration#use-color-mode)藏在**默认主题**的文档里，而不是**默认主题的博客插件**的文档里，导致我读的时候直接略过了……最后又是到 Docusaurus 的 GitHub Repo 里找了一通，才找到了相关内容：

- https://github.com/facebook/docusaurus/discussions/9196

我们先定义好 Docusaurus ColorMode和 Giscus Theme 之间的映射，再通过这个 API 来拿到当前读者选择的 ColorMode ，并让 Giscus 使用与之对应 Theme ：

```tsx
// other imports......
import { useColorMode, ColorMode } from '@docusaurus/theme-common';
import Giscus, { Theme } from '@giscus/react';

const DocusaurusColorModeToGiscusTheme: Record<ColorMode, Theme> = {
  light: 'light',
  dark: 'dark_dimmed'
};

export default function BlogPostItemWrapper(props: Props): JSX.Element {
  // ......
  
  const { colorMode } = useColorMode();
  const giscusTheme = DocusaurusColorModeToGiscusTheme[colorMode];

  const GiscusContainer = (
    <Giscus
      {/* ...... */}
      theme={giscusTheme}
    />
  );

  // ......
}
```

再次打开预览测试，此时 Giscus Theme 应该会随着 Docusaurus ColorMode 的切换而切换。唯一的一点小瑕疵是 Giscus 组件的颜色变换是瞬间完成的，不像 Docusaurus 内部其他组件一样有过渡动画。

### 另一种让 Giscus 变色的方式

这个方法是我写这篇文章的时候脑补出来的，还没实现过，留作习题供读者尝试（doge）。

简单来说就是 Giscus 的主题可以是自定义的 CSS 。而我们知道在 CSS 中实现日夜切换的常规操作是通过 CSS 变量，让组件在不同模式下继承不同的变量得到不同的前景色和背景色。

那么这里理论上更优雅的实现方式，是我们为 Giscus 编写一套 Docusaurus Theme ，将 Giscus 所有颜色交由 Docusaurus 管理，这样可以让 Giscus 和 Docusaurus 更加融合统一。

## 结语

我们使用 Docusaurus Swizzling 将 Giscus 嵌入了 Docusaurus 中，并添加了日夜颜色切换的功能，接下来就可以通过这个评论区愉快地和小伙伴们聊天啦！（现实是根本没有小伙伴 QAQ）
