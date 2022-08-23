import path from "path";
import { promises as fs } from "fs";
import type { ParsedUrlQuery } from "querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import type { MarkdownContent } from "../components";
import { Markdown, parseMarkdown } from "../components";
import { getTitle } from "../utils/markdown";

const pages = ["sponsor", "patrons", "about"] as const;

interface PageParams extends ParsedUrlQuery {
  page: typeof pages[number];
}

interface PageProps {
  title: string;
  content: MarkdownContent;
}

const Page: NextPage<PageProps> = ({ title, content }) => {
  return (
    <div className="h-full flex justify-center items-center">
      <article className="max-w-full p-8">
        <Head>
          <title>{`${title} - Aadit M Shah`}</title>
        </Head>
        <Markdown content={content} />
      </article>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<PageParams> = () => ({
  paths: pages.map((page) => ({ params: { page } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<PageProps, PageParams> = async (
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

export default Page;
