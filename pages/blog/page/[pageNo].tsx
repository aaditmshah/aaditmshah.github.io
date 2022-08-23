import path from "path";
import { promises as fs } from "fs";
import type { ParsedUrlQuery } from "querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import type { MarkdownContent, MetaDataProps } from "../../../components";
import { Markdown, parseMarkdown, MetaData, Paging } from "../../../components";
import { getPostData, markdown } from "../../../utils/markdown";
import { getTimestamps } from "../../../utils/date";

const pageSize = 5;

interface BlogParams extends ParsedUrlQuery {
  pageNo: string;
}

interface Post extends MetaDataProps {
  name: string;
  title: string;
  summary: MarkdownContent;
}

interface BlogProps {
  totalPages: number;
  pageNo: number;
  start: number;
  end: number;
  posts: Post[];
}

const Blog: NextPage<BlogProps> = ({
  totalPages,
  pageNo,
  start,
  end,
  posts,
}) => {
  const title =
    start < end ? `Blog posts ${start}-${end}` : `Blog post ${start}`;
  const getPageLink = (pageNo: number) => `/blog/page/${pageNo}`;
  return (
    <div className="h-full flex justify-center items-center">
      <article className="max-w-full p-8">
        <header>
          <Head>
            <title>{title}</title>
          </Head>
          <h1 className="text-3xl font-bold">{title}</h1>
        </header>
        <Paging
          totalPages={totalPages}
          pageNo={pageNo}
          getPageLink={getPageLink}
        />
        {posts.map(({ name, title, summary, published, modified, tags }) => (
          <article key={name} className="mt-4">
            <header>
              <Link href={`/blog/${name}`}>
                <a>
                  <h1 className="inline font-bold text-2xl text-orange">
                    {title}
                  </h1>
                </a>
              </Link>
              <MetaData published={published} modified={modified} tags={tags} />
            </header>
            <Markdown content={summary} />
          </article>
        ))}
        <Paging
          totalPages={totalPages}
          pageNo={pageNo}
          getPageLink={getPageLink}
        />
      </article>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<BlogParams> = async () => {
  const dirPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(dirPath);
  const { length } = fileNames.filter((fileName) => markdown.test(fileName));
  const totalPages = Math.ceil(length / pageSize);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { pageNo: String(i + 1) },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<BlogProps, BlogParams> = async (
  context
) => {
  const pageNo = context.params?.pageNo;
  if (typeof pageNo === "undefined") throw new Error("invalid page number");
  const pageIndex = Number.parseInt(pageNo, 10) - 1;
  const dirPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(dirPath);
  const posts: Post[] = [];
  for (const fileName of fileNames) {
    const result = markdown.exec(fileName);
    if (result !== null) {
      const name = result[1] || "";
      const filePath = path.join(dirPath, fileName);
      const text = await fs.readFile(filePath, "utf8");
      const content = parseMarkdown(text);
      const { title, tags, summary } = getPostData(content);
      const { published, modified } = await getTimestamps(filePath);
      posts.push({ name, title, tags, summary, published, modified });
    }
  }
  posts.sort((a, b) => b.published - a.published);
  const totalPages = Math.ceil(posts.length / pageSize);
  const start = pageIndex * pageSize;
  const end = Math.min(start + pageSize, posts.length);
  return {
    props: {
      totalPages,
      pageNo: pageIndex + 1,
      start: start + 1,
      end,
      posts: posts.slice(start, end),
    },
  };
};

export default Blog;
