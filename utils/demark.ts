import type { Stream } from "@demark/parser";
import {
  parse,
  pure,
  map,
  alt as union,
  some,
  many,
  decode,
  text,
  group,
  tagged
} from "@demark/parser";

interface Tag {
  tag: string;
}

interface Code extends Tag {
  tag: "Code";
  value: string;
}

interface Link extends Tag {
  tag: "Link";
  anchor: Stream<Code | string>;
  href: string;
}

type Inline = Code | Link | string;

type BulletItem = Stream<Inline>;

interface BulletList extends Tag {
  tag: "BulletList";
  items: Stream<BulletItem>;
}

interface Image extends Tag {
  tag: "Image";
  asset: string;
  width: number;
  height: number;
  priority: boolean;
  alt: string;
  caption: string;
}

interface Paragraph extends Tag {
  tag: "Paragraph";
  content: Stream<Inline>;
}

type Block = BulletList | Image | Paragraph;

interface Section extends Tag {
  tag: "Section";
  title: string;
  subtitle: Inline | null;
  content: Stream<Block>;
}

interface ArticleContent {
  introduction: Stream<Block>;
  sections: Section[];
}

interface Article extends Tag, ArticleContent {
  tag: "Article";
  title: string;
  tags: string[];
}

const createCode = (value: string): Code => ({ tag: "Code", value });

const createLink = (anchor: Stream<Code | string>, href: string): Link => ({
  tag: "Link",
  anchor,
  href
});

const createBulletList = (items: Stream<BulletItem>): BulletList => ({
  tag: "BulletList",
  items
});

const createImage = (
  asset: string,
  width: string,
  height: string,
  priority: string,
  alt: string,
  caption: string
): Image => ({
  tag: "Image",
  asset,
  width: Number.parseInt(width, 10),
  height: Number.parseInt(height, 10),
  priority: priority === "high",
  alt,
  caption
});

const createParagraph = (content: Stream<Inline>): Paragraph => ({
  tag: "Paragraph",
  content
});

const createSection = (
  title: string,
  subtitle: Inline | null,
  content: Stream<Block>
): Section => ({ tag: "Section", title, subtitle, content });

const createArticleContent = (
  introduction: Stream<Block>,
  sections: Section[]
): ArticleContent => ({ introduction, sections });

const createArticle = (
  title: string,
  tags: string[],
  content: ArticleContent
): Article => ({ tag: "Article", title, tags, ...content });

const code = group(map(createCode, tagged("code", text)));

const link = group(
  map(createLink, tagged("link", some(union(code, text))), tagged("href", text))
);

const inline = union(code, link, text);

const bulletList = group(
  map(createBulletList, some(tagged("bullet", some(inline))))
);

const image = group(
  map(
    createImage,
    tagged("image", text),
    tagged("width", text),
    tagged("height", text),
    union(tagged("priority", text), pure("low")),
    tagged("alt", text),
    tagged("caption", text)
  )
);

const paragraph = group(
  map(createParagraph, tagged("paragraph", some(inline)))
);

const block = union(bulletList, image, paragraph);

const section = group(
  map(
    createSection,
    tagged("section", text),
    // eslint-disable-next-line unicorn/no-null -- required
    union(tagged("subtitle", inline), pure(null)),
    tagged("content", some(block))
  )
);

const articleContent = map(createArticleContent, some(block), many(section));

const article = map(
  createArticle,
  tagged("article", text),
  many(tagged("tag", text)),
  tagged("content", articleContent)
);

const parseArticle = (bytes: Uint8Array) => decode(article, parse(bytes));

const demark = /(?<filename>.+)\.dm$/u;

export type {
  Code,
  Link,
  Inline,
  BulletList,
  Image,
  Paragraph,
  Block,
  Section,
  ArticleContent,
  Article
};
export { parseArticle, demark };
