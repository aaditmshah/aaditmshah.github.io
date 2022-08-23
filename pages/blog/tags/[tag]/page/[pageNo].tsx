import { promises as fs } from "node:fs";
import path from "node:path";
import type { ParsedUrlQuery } from "node:querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback } from "react";
import type {
  MarkdownContent,
  MetaDataProperties
} from "../../../../../components";
import {
  Markdown,
  parseMarkdown,
  MetaData,
  Paging
} from "../../../../../components";
import { getTimestamps } from "../../../../../utils/date";
import { getPostData, markdown } from "../../../../../utils/markdown";

const pageSize = 5;

interface TagParameters extends ParsedUrlQuery {
  tag: string;
  pageNo: string;
}

interface Post extends MetaDataProperties {
  name: string;
  title: string;
  summary: MarkdownContent;
}

interface TagProperties {
  totalPages: number;
  pageNo: number;
  start: number;
  end: number;
  tag: string;
  posts: Post[];
}

const Tag: NextPage<TagProperties> = ({
  totalPages,
  pageNo,
  start,
  end,
  tag,
  posts
}: TagProperties) => {
  const title =
    start < end
      ? `Blog posts ${start}-${end} tagged "${tag}"`
      : `Blog post ${start} tagged "${tag}"`;
  const getPageLink = useCallback(
    (pageNumber: number) => `/blog/tags/${tag}/page/${pageNumber}`,
    [tag]
  );
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
        {posts.map(
          ({ name, title: postTitle, summary, published, modified, tags }) => (
            <article key={name} className="mt-4">
              <header>
                <Link href={`/blog/${name}`}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- href provided by Link */}
                  <a>
                    <h1 className="inline font-bold text-2xl text-orange">
                      {postTitle}
                    </h1>
                  </a>
                </Link>
                <MetaData
                  published={published}
                  modified={modified}
                  tags={tags}
                />
              </header>
              <Markdown content={summary} />
            </article>
          )
        )}
        <Paging
          totalPages={totalPages}
          pageNo={pageNo}
          getPageLink={getPageLink}
        />
      </article>
    </div>
  );
};

const getStaticPaths: GetStaticPaths<TagParameters> = async () => {
  const directoryPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(directoryPath);
  const tagMap = new Map<string, number>();
  for (const fileName of fileNames) {
    if (markdown.test(fileName)) {
      const filePath = path.join(directoryPath, fileName);
      const text = await fs.readFile(filePath, "utf8");
      const content = parseMarkdown(text);
      const { tags } = getPostData(content);
      for (const tag of tags) {
        const count = tagMap.get(tag) ?? 0;
        tagMap.set(tag, count + 1);
      }
    }
  }
  const paths = [...tagMap].flatMap(([tag, length]) => {
    const totalPages = Math.ceil(length / pageSize);
    return Array.from({ length: totalPages }, (_, index) => ({
      params: { tag, pageNo: String(index + 1) }
    }));
  });
  return { paths, fallback: false };
};

const getStaticProps: GetStaticProps<TagProperties, TagParameters> = async (
  context
) => {
  const tag = context.params?.tag;
  if (typeof tag === "undefined") throw new Error("invalid tag");
  const pageNo = context.params?.pageNo;
  if (typeof pageNo === "undefined") throw new Error("invalid page number");
  const pageIndex = Number.parseInt(pageNo, 10) - 1;
  const directoryPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(directoryPath);
  const posts: Post[] = [];
  for (const fileName of fileNames) {
    const result = markdown.exec(fileName);
    if (result !== null) {
      const name = result[1] ?? "";
      const filePath = path.join(directoryPath, fileName);
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
      posts: posts.slice(start, end)
    }
  };
};

export { getStaticPaths, getStaticProps };
export default Tag;
