import type { Root as MarkdownContent } from "mdast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkUnwrapImages from "remark-unwrap-images";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import type { ComponentType } from "react";
import { createElement, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { assets } from "../assets";

const absolutePath = /^\//;
const assetFormat = /^(\w+)-(\d+)x(\d+)(-priority)?$/;

const components: {
  [TagName in keyof JSX.IntrinsicElements]?: ComponentType<
    JSX.IntrinsicElements[TagName]
  >;
} = {
  h1: ({ children }) => (
    <header>
      <h1 className="text-3xl font-bold">{children}</h1>
    </header>
  ),
  h2: ({ children }) => <h2 className="mt-4 text-2xl font-bold">{children}</h2>,
  p: ({ children }) => <p className="mt-4">{children}</p>,
  a: ({ href, children }) => {
    if (typeof href === "undefined") throw new Error("href missing");

    return absolutePath.test(href) ? (
      <Link href={href}>
        <a className="text-orange font-bold">{children}</a>
      </Link>
    ) : (
      <a href={href} className="text-orange font-bold">
        {children}
      </a>
    );
  },
  img: ({ src, alt, title }) => {
    if (typeof src === "undefined") throw new Error("src missing");
    if (typeof alt === "undefined") throw new Error("alt missing");
    if (typeof title === "undefined") throw new Error("title missing");

    const result = assetFormat.exec(src);

    if (result === null) throw new Error("asset format invalid");

    const key = result[1] || "";
    const width = Number.parseInt(result[2] || "", 10);
    const height = Number.parseInt(result[3] || "", 10);
    const priority = result[4] === "-priority";

    return (
      <figure className="mt-4 text-center">
        <Image
          src={assets[key] || ""}
          alt={alt}
          width={width}
          height={height}
          quality={100}
          layout="intrinsic"
          priority={priority}
        />
        <figcaption>{title}</figcaption>
      </figure>
    );
  },
  ul: ({ children }) => (
    <ul className="mt-4 list-disc list-inside">{children}</ul>
  ),
  code: ({ children }) => (
    <code className="text-sm text-orange">{children}</code>
  ),
};

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkUnwrapImages)
  .use(remarkRehype)
  .use(rehypeReact, { createElement, Fragment, components });

interface MarkdownProps {
  content: MarkdownContent;
}

export const Markdown = ({ content }: MarkdownProps) =>
  processor.stringify(processor.runSync(content));

export const parseMarkdown = (text: string) => processor.parse(text);

export type { MarkdownContent };
