import { promises as fs } from "node:fs";
import path from "node:path";
import type { ParsedUrlQuery } from "node:querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import type { MarkdownContent } from "components/markdown";
import { Markdown, parseMarkdown } from "components/markdown";
import type { MetaDataProperties } from "components/metadata";
import { MetaData } from "components/metadata";
import { getTimestamps } from "utils/date";
import { getPostData, markdown } from "utils/markdown";

interface PostParameters extends ParsedUrlQuery {
  post: string;
}

interface PostProperties extends MetaDataProperties {
  title: string;
  content: MarkdownContent;
}

const Post: NextPage<PostProperties> = ({
  title,
  content,
  published,
  modified,
  tags
}: PostProperties) => (
  <div className="h-full flex justify-center items-center">
    <article className="max-w-full p-8">
      <header>
        <Head>
          <title>{title}</title>
        </Head>
        <h1 className="text-3xl font-bold">{title}</h1>
        <MetaData published={published} modified={modified} tags={tags} />
      </header>
      <Markdown content={content} />
    </article>
  </div>
);

const getStaticPaths: GetStaticPaths<PostParameters> = async () => {
  const directoryPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(directoryPath);
  const paths: { params: { post: string } }[] = [];
  for (const fileName of fileNames) {
    const result = markdown.exec(fileName);
    if (result !== null) paths.push({ params: { post: result[1] ?? "" } });
  }
  return { paths, fallback: false };
};

const getStaticProps: GetStaticProps<PostProperties, PostParameters> = async (
  context
) => {
  const name = context.params?.post;
  if (typeof name === "undefined") throw new Error("invalid post name");
  const filePath = `content/blog/${name}.md`;
  const fileName = path.join(process.cwd(), filePath);
  const text = await fs.readFile(fileName, "utf8");
  const content = parseMarkdown(text);
  const { title, tags } = getPostData(content);
  const { published, modified } = await getTimestamps(filePath);
  return { props: { title, content, published, modified, tags } };
};

// eslint-disable-next-line import/no-unused-modules -- Next.js SSG Functions
export { getStaticPaths, getStaticProps };
// eslint-disable-next-line import/no-unused-modules -- Next.js Page Component
export default Post;
