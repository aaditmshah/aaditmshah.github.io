import { promises as fs } from "node:fs";
import path from "node:path";
import type { ParsedUrlQuery } from "node:querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { ArticleContentComponent } from "components/demark";
import { MetaData } from "components/metadata";
import { getTimestamps } from "utils/date";
import type { Article } from "utils/demark";
import { parseArticle, demark } from "utils/demark";

interface PostParameters extends ParsedUrlQuery {
  post: string;
}

interface PostProperties {
  article: Article;
  published: number;
  modified: number;
}

const Post: NextPage<PostProperties> = ({
  article,
  published,
  modified
}: PostProperties) => (
  <div className="h-full flex justify-center items-center">
    <article className="max-w-full p-8">
      <header>
        <Head>
          <title>{article.title}</title>
        </Head>
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <MetaData
          published={published}
          modified={modified}
          tags={article.tags}
        />
      </header>
      <ArticleContentComponent content={article} />
    </article>
  </div>
);

const getStaticPaths: GetStaticPaths<PostParameters> = async () => {
  const directoryPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(directoryPath);
  const paths: { params: { post: string } }[] = [];
  for (const fileName of fileNames) {
    const result = demark.exec(fileName);
    if (result !== null) paths.push({ params: { post: result[1] ?? "" } });
  }
  return { paths, fallback: false };
};

const getStaticProps: GetStaticProps<PostProperties, PostParameters> = async (
  context
) => {
  const name = context.params?.post;
  if (typeof name === "undefined") throw new Error("invalid post name");
  const filePath = `content/blog/${name}.dm`;
  const fileName = path.join(process.cwd(), filePath);
  const bytes = await fs.readFile(fileName);
  const article = parseArticle(bytes);
  const { published, modified } = await getTimestamps(filePath);
  return { props: { article, published, modified } };
};

// eslint-disable-next-line import/no-unused-modules -- Next.js SSG Functions
export { getStaticPaths, getStaticProps };
// eslint-disable-next-line import/no-unused-modules -- Next.js Page Component
export default Post;
