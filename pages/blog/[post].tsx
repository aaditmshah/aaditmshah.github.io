import path from "path";
import { promises as fs } from "fs";
import type { ParsedUrlQuery } from "querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import type { MarkdownContent, MetaDataProps } from "../../components";
import { Markdown, parseMarkdown, MetaData } from "../../components";
import { getPostData, markdown } from "../../utils/markdown";
import { getTimestamps } from "../../utils/date";

interface PostParams extends ParsedUrlQuery {
  post: string;
}

interface PostProps extends MetaDataProps {
  title: string;
  content: MarkdownContent;
}

const Post: NextPage<PostProps> = ({
  title,
  content,
  published,
  modified,
  tags,
}) => {
  return (
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
};

export const getStaticPaths: GetStaticPaths<PostParams> = async () => {
  const dirPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(dirPath);
  const paths: { params: { post: string } }[] = [];
  for (const fileName of fileNames) {
    const result = markdown.exec(fileName);
    if (result !== null) paths.push({ params: { post: result[1] || "" } });
  }
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<PostProps, PostParams> = async (
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

export default Post;
