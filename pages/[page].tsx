import { promises as fs } from "node:fs";
import path from "node:path";
import type { ParsedUrlQuery } from "node:querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ArticleComponent } from "components/demark";
import type { Article } from "utils/demark";
import { parseArticle } from "utils/demark";

const pages = ["sponsor", "patrons", "about"] as const;

interface PageParameters extends ParsedUrlQuery {
  page: typeof pages[number];
}

interface PageProperties {
  article: Article;
}

const Page: NextPage<PageProperties> = ({ article }: PageProperties) => (
  <div className="h-full flex justify-center items-center">
    <article className="max-w-full p-8">
      <Head>
        <title>{`${article.title} - Aadit M Shah`}</title>
      </Head>
      <ArticleComponent article={article} />
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
  const fileName = path.join(process.cwd(), `content/${page}.dm`);
  const bytes = await fs.readFile(fileName);
  const article = parseArticle(bytes);
  return { props: { article } };
};

// eslint-disable-next-line import/no-unused-modules -- Next.js SSG Functions
export { getStaticPaths, getStaticProps };
// eslint-disable-next-line import/no-unused-modules -- Next.js Page Component
export default Page;
