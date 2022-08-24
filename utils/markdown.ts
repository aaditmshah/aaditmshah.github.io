import { parse } from "yaml";
import { string, array, object } from "./decoders";
import type { MarkdownContent } from "components/markdown";

const decoder = object({ title: string, tags: array(string) });

const markdown = /(?<filename>.+)\.md$/u;

const getTitle = ({ children: [heading] }: MarkdownContent) => {
  if (typeof heading === "undefined" || heading.type !== "heading") {
    throw new Error("heading missing");
  }
  if (heading.depth !== 1 || heading.children.length !== 1) {
    throw new Error("invalid heading");
  }
  const [text] = heading.children;
  if (typeof text === "undefined" || text.type !== "text") {
    throw new Error("invalid title");
  }
  return text.value;
};

const getPostData = ({
  children: [frontmatter, abstract]
}: MarkdownContent) => {
  if (typeof frontmatter === "undefined" || frontmatter.type !== "yaml") {
    throw new Error("front matter missing");
  }
  if (typeof abstract === "undefined" || abstract.type !== "paragraph") {
    throw new Error("abstract missing");
  }
  const { title, tags } = decoder.decode(parse(frontmatter.value));
  const summary: MarkdownContent = {
    type: "root",
    children: [abstract]
  };
  return { title, tags, summary };
};

export { markdown, getTitle, getPostData };
