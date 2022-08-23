import { promises as fs } from "node:fs";
import path from "node:path";
import type { ParsedUrlQuery } from "node:querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import type { MarkdownContent } from "../components";
import { Markdown, parseMarkdown } from "../components";
import { getTitle } from "../utils/markdown";

const pages = ["sponsor", "patrons", "about"] as const;

interface PageParameters extends ParsedUrlQuery {
  page: typeof pages[number];
}

interface PageProperties {
  title: string;
  content: MarkdownContent;
}

const Page: NextPage<PageProperties> = ({ title, content }: PageProperties) => (
  <div className="h-full flex justify-center items-center">
    <article className="max-w-full p-8">
      <Head>
        <title>{`${title} - Aadit M Shah`}</title>
      </Head>
      <Markdown content={content} />
    </article>
  </div>
);

const getStaticPaths: GetStaticPaths<PageParameters> = () => ({
  paths: pages.map((page) => ({ params: { page } })),
  fallback: false
});

const getStaticProps: GetStaticProps<PageProperties, PageParameters> = async (
  context
) => {
  const page = context.params?.page;
  if (typeof page === "undefined") throw new Error("invalid page name");
  const fileName = path.join(process.cwd(), `content/${page}.md`);
  const text = await fs.readFile(fileName, "utf8");
  const content = parseMarkdown(text);
  const title = getTitle(content);
  return { props: { title, content } };
};

export { getStaticPaths, getStaticProps };
export default Page;
