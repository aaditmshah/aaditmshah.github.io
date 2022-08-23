import path from "path";
import { promises as fs } from "fs";
import type { ParsedUrlQuery } from "querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import type { MarkdownContent, MetaDataProps } from "../../../../../components";
import {
  Markdown,
  parseMarkdown,
  MetaData,
  Paging,
} from "../../../../../components";
import { getPostData, markdown } from "../../../../../utils/markdown";
import { getTimestamps } from "../../../../../utils/date";

const pageSize = 5;

interface TagParams extends ParsedUrlQuery {
  tag: string;
  pageNo: string;
}

interface Post extends MetaDataProps {
  name: string;
  title: string;
  summary: MarkdownContent;
}

interface TagProps {
  totalPages: number;
  pageNo: number;
  start: number;
  end: number;
  tag: string;
  posts: Post[];
}

const Tag: NextPage<TagProps> = ({
  totalPages,
  pageNo,
  start,
  end,
  tag,
  posts,
}) => {
  const title =
    start < end
      ? `Blog posts ${start}-${end} tagged "${tag}"`
      : `Blog post ${start} tagged "${tag}"`;
  const getPageLink = (pageNo: number) => `/blog/tags/${tag}/page/${pageNo}`;
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

export const getStaticPaths: GetStaticPaths<TagParams> = async () => {
  const dirPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(dirPath);
  const tagMap = new Map<string, number>();
  const tagSet = new Set<string>();
  for (const fileName of fileNames) {
    if (markdown.test(fileName)) {
      const filePath = path.join(dirPath, fileName);
      const text = await fs.readFile(filePath, "utf8");
      const content = parseMarkdown(text);
      const { tags } = getPostData(content);
      for (const tag of tags) {
        const count = tagMap.get(tag) || 0;
        tagMap.set(tag, count + 1);
      }
    }
  }
  const paths = Array.from(tagMap).flatMap(([tag, length]) => {
    const totalPages = Math.ceil(length / pageSize);
    return Array.from({ length: totalPages }, (_, i) => ({
      params: { tag, pageNo: String(i + 1) },
    }));
  });
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<TagProps, TagParams> = async (
  context
) => {
  const tag = context.params?.tag;
  if (typeof tag === "undefined") throw new Error("invalid tag");
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
      if (tags.includes(tag)) {
        posts.push({ name, title, tags, summary, published, modified });
      }
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
      tag,
      posts: posts.slice(start, end),
    },
  };
};

export default Tag;
