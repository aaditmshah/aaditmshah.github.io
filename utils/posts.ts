import { promises as fs } from "node:fs";
import path from "node:path";
import { getTimestamps } from "./date";
import type { Article } from "./demark";
import { parseArticle, demark } from "./demark";

const pageSize = 5;

interface Post {
  name: string;
  article: Article;
  published: number;
  modified: number;
}

const getTags = async (filePath: string) => {
  const bytes = await fs.readFile(filePath);
  const article = parseArticle(bytes);
  return article.tags;
};

const getPost = async (name: string, filePath: string): Promise<Post> => {
  const bytes = await fs.readFile(filePath);
  const article = parseArticle(bytes);
  const { published, modified } = await getTimestamps(filePath);
  return { name, article, published, modified };
};

const getPosts = async (directoryPath: string, fileNames: string[]) => {
  const promises: Promise<Post>[] = [];
  for (const fileName of fileNames) {
    const result = demark.exec(fileName);
    if (result !== null) {
      const name = result[1] ?? "";
      const filePath = path.join(directoryPath, fileName);
      promises.push(getPost(name, filePath));
    }
  }
  return Promise.all(promises);
};

export type { Post };
export { pageSize, getTags, getPosts };
