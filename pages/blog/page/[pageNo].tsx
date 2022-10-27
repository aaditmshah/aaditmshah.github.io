import { promises as fs } from "node:fs";
import path from "node:path";
import type { ParsedUrlQuery } from "node:querystring";
import type { NextPage, GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { ArticleContentComponent } from "components/demark";
import { MetaData } from "components/metadata";
import { Paging } from "components/paging";
import { demark } from "utils/demark";
import type { Post } from "utils/posts";
import { pageSize, getPosts } from "utils/posts";

interface BlogParameters extends ParsedUrlQuery {
  pageNo: string;
}

interface BlogProperties {
  totalPages: number;
  pageNo: number;
  start: number;
  end: number;
  posts: Post[];
}

const getPageLink = (pageNo: number) => `/blog/page/${pageNo}`;

const Blog: NextPage<BlogProperties> = ({
  totalPages,
  pageNo,
  start,
  end,
  posts
}: BlogProperties) => {
  const title =
    start < end ? `Blog posts ${start}-${end}` : `Blog post ${start}`;
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

const getStaticPaths: GetStaticPaths<BlogParameters> = async () => {
  const directoryPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(directoryPath);
  const { length } = fileNames.filter((fileName) => demark.test(fileName));
  const totalPages = Math.ceil(length / pageSize);
  const paths = Array.from({ length: totalPages }, (_, index) => ({
    params: { pageNo: String(index + 1) }
  }));
  return { paths, fallback: false };
};

const getStaticProps: GetStaticProps<BlogProperties, BlogParameters> = async (
  context
) => {
  const pageNo = context.params?.pageNo;
  if (typeof pageNo === "undefined") throw new Error("invalid page number");
  const pageIndex = Number.parseInt(pageNo, 10) - 1;
  const directoryPath = path.join(process.cwd(), "content/blog");
  const fileNames = await fs.readdir(directoryPath);
  const posts = await getPosts(directoryPath, fileNames);
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
      posts: posts.slice(start, end)
    }
  };
};

// eslint-disable-next-line import/no-unused-modules -- Next.js SSG Functions
export { getStaticPaths, getStaticProps };
// eslint-disable-next-line import/no-unused-modules -- Next.js Page Component
export default Blog;
