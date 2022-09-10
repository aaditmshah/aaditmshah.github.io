import { string, array, object, cast } from "typecraft";
import { parse } from "yaml";
import type { MarkdownContent } from "components/markdown";

const castFrontmatter = cast(object({ title: string, tags: array(string) }));

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
  const result = castFrontmatter(parse(frontmatter.value));
  if (result.status === "failure") {
    // eslint-disable-next-line no-console -- contains debugging information
    console.error(result);
    throw new TypeError("could not typecast the frontmatter");
  }
  const { title, tags } = result.value;
  const summary: MarkdownContent = {
    type: "root",
    children: [abstract]
  };
  return { title, tags, summary };
};

export { markdown, getTitle, getPostData };
