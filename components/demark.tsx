import NextImage from "next/image";
import NextLink from "next/link";
import { assets } from "assets";
import type {
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
} from "utils/demark";

const CodeComponent = ({ code: { value } }: { code: Code }) => (
  <code className="text-sm text-orange">{value}</code>
);

const LinkComponent = ({ link: { anchor, href } }: { link: Link }) => {
  const children = anchor.map((node, nodeIndex) => {
    const key = `Link_${nodeIndex}`;
    return <InlineComponent key={key} inline={node} />;
  });
  return href.startsWith("/") ? (
    <NextLink href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- href provided by Link */}
      <a className="text-orange font-bold">{children}</a>
    </NextLink>
  ) : (
    <a href={href} className="text-orange font-bold">
      {children}
    </a>
  );
};

function InlineComponent({ inline }: { inline: Inline }) {
  if (typeof inline === "string") return <>{inline}</>;
  if (inline.tag === "Code") return <CodeComponent code={inline} />;
  return <LinkComponent link={inline} />;
}

const BulletListComponent = ({
  bulletList: { items }
}: {
  bulletList: BulletList;
}) => (
  <ul className="mt-4 list-disc list-inside">
    {items.map((item, itemIndex) => {
      const itemKey = `BulletList_${itemIndex}`;
      return (
        <li key={itemKey}>
          {item.map((node, nodeIndex) => {
            const nodeKey = `BulletItem_${nodeIndex}`;
            return <InlineComponent key={nodeKey} inline={node} />;
          })}
        </li>
      );
    })}
  </ul>
);

const ImageComponent = ({
  image: { asset, width, height, priority, alt, caption }
}: {
  image: Image;
}) => (
  <figure className="mt-4 text-center">
    <NextImage
      src={assets[asset] ?? ""}
      alt={alt}
      width={width}
      height={height}
      quality={100}
      layout="intrinsic"
      priority={priority}
    />
    <figcaption>{caption}</figcaption>
  </figure>
);

const ParagraphComponent = ({
  paragraph: { content }
}: {
  paragraph: Paragraph;
}) => (
  <p className="mt-4">
    {content.map((node, nodeIndex) => {
      const key = `Paragraph_${nodeIndex}`;
      return <InlineComponent key={key} inline={node} />;
    })}
  </p>
);

const BlockComponent = ({ block }: { block: Block }) => {
  switch (block.tag) {
    case "BulletList":
      return <BulletListComponent bulletList={block} />;
    case "Image":
      return <ImageComponent image={block} />;
    default:
      return <ParagraphComponent paragraph={block} />;
  }
};

const SectionComponent = ({
  section: { title, subtitle, content }
}: {
  section: Section;
}) => (
  <section>
    <h2 className="mt-4 text-2xl font-bold">
      {title}
      {subtitle !== null && (
        <>
          {" "}
          <span className="text-sm">
            <InlineComponent inline={subtitle} />
          </span>
        </>
      )}
    </h2>
    {content.map((block, blockIndex) => {
      const key = `Section_${blockIndex}_${block.tag}`;
      return <BlockComponent key={key} block={block} />;
    })}
  </section>
);

const ArticleContentComponent = ({
  content: { introduction, sections }
}: {
  content: ArticleContent;
}) => (
  <>
    {introduction.map((block, index) => {
      const key = `ArticleContent_${index}_${block.tag}`;
      return <BlockComponent key={key} block={block} />;
    })}
    {sections.map((section, index) => {
      const key = `Article_${index}_${section.tag}`;
      return <SectionComponent key={key} section={section} />;
    })}
  </>
);

const ArticleComponent = ({
  article: { title, introduction, sections }
}: {
  article: Article;
}) => (
  <>
    <header>
      <h1 className="text-3xl font-bold">{title}</h1>
    </header>
    <ArticleContentComponent content={{ introduction, sections }} />
  </>
);

export { ArticleComponent, ArticleContentComponent };
