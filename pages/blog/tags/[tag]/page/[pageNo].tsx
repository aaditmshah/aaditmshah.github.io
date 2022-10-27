import { promises as fs } from "node:fs";
import path from "node:path";
import type { ParsedUrlQuery } from "node:querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback } from "react";
import { ArticleContentComponent } from "components/demark";
import { MetaData } from "components/metadata";
import { Paging } from "components/paging";
import { demark } from "utils/demark";
import type { Post } from "utils/posts";
import { pageSize, getTags, getPosts } from "utils/posts";

interface TagParameters extends ParsedUrlQuery {
  tag: string;
  pageNo: string;
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
        {posts.map(({ name, article, published, modified }) => (
          <article key={name} className="mt-4">
            <header>
              <Link href={`/blog/${name}`}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- href provided by Link */}
                <a>
                  <h1 className="inline font-bold text-2xl text-orange">
                    {article.title}
                  </h1>
                </a>
              </Link>
              <MetaData
                published={published}
                modified={modified}
                tags={article.tags}
              />
            </header>
            <ArticleContentComponent content={{ ...article, sections: [] }} />
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

const getStaticPaths: GetStaticPaths<TagParameters> = async () => {
  const directoryPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(directoryPath);
  const promises: Promise<string[]>[] = [];
  for (const fileName of fileNames) {
    if (demark.test(fileName)) {
      const filePath = path.join(directoryPath, fileName);
      promises.push(getTags(filePath));
    }
  }
  const tagBag = await Promise.all(promises);
  const tagMap = new Map<string, number>();
  for (const tags of tagBag) {
    for (const tag of tags) {
      const count = tagMap.get(tag) ?? 0;
      tagMap.set(tag, count + 1);
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
  const allPosts = await getPosts(directoryPath, fileNames);
  const posts = allPosts.filter(({ article }) => article.tags.includes(tag));
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

// eslint-disable-next-line import/no-unused-modules -- Next.js SSG Functions
export { getStaticPaths, getStaticProps };
// eslint-disable-next-line import/no-unused-modules -- Next.js Page Component
export default Tag;
