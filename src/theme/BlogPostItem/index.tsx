import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import type BlogPostItemType from '@theme/BlogPostItem';
import type { WrapperProps } from '@docusaurus/types';
import { useColorMode, ColorMode } from '@docusaurus/theme-common';
import Giscus, { Theme } from '@giscus/react';

const DocusaurusColorModeToGiscusTheme: Record<ColorMode, Theme> = {
  light: 'light',
  dark: 'dark_dimmed'
};

type Props = WrapperProps<typeof BlogPostItemType>;

export default function BlogPostItemWrapper(props: Props): JSX.Element {
  const { isBlogPostPage } = useBlogPost();

  const { colorMode } = useColorMode();
  const giscusTheme = DocusaurusColorModeToGiscusTheme[colorMode];

  const GiscusContainer = (
    <Giscus
      id="comments"
      repo="VVsxmja/vvsxmja.github.io"
      repoId="R_kgDOMA4jBQ"
      category="Blog Post Comments"
      categoryId="DIC_kwDOMA4jBc4Ch7I-"
      mapping="url"
      strict="1"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={giscusTheme}
      lang="zh-CN"
      loading="eager"
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
