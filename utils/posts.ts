import { promises as fs } from "node:fs";
import path from "node:path";
import { getTimestamps } from "./date";
import { getPostData, markdown } from "./markdown";
import type { MarkdownContent } from "components/markdown";
import { parseMarkdown } from "components/markdown";
import type { MetaDataProperties } from "components/metadata";

const pageSize = 5;

interface Post extends MetaDataProperties {
  name: string;
  title: string;
  summary: MarkdownContent;
}

const getTags = async (filePath: string) => {
  const text = await fs.readFile(filePath, "utf8");
  const content = parseMarkdown(text);
  const { tags } = getPostData(content);
  return tags;
};

const getPost = async (name: string, filePath: string): Promise<Post> => {
  const text = await fs.readFile(filePath, "utf8");
  const content = parseMarkdown(text);
  const { title, tags, summary } = getPostData(content);
  const { published, modified } = await getTimestamps(filePath);
  return { name, title, tags, summary, published, modified };
};

const getPosts = async (directoryPath: string, fileNames: string[]) => {
  const promises: Promise<Post>[] = [];
  for (const fileName of fileNames) {
    const result = markdown.exec(fileName);
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
