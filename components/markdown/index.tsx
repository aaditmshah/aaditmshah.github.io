import ReactMarkdown from "react-markdown";
import type { NormalComponents } from "react-markdown/lib/complex-types";
import type { SpecialComponents } from "react-markdown/lib/ast-to-react";
import remarkUnwrapImages from "remark-unwrap-images";
import { H1 } from "./h1";
import { H2 } from "./h2";
import { P } from "./p";
import { A } from "./a";
import { Img } from "./img";
import { UL } from "./ul";

type Components = Omit<NormalComponents, keyof SpecialComponents> &
  SpecialComponents;

const components: Partial<Components> = {
  h1: H1,
  h2: H2,
  p: P,
  a: A,
  img: Img,
  ul: UL,
};

interface MarkdownProps {
  content: string;
}

export const Markdown = ({ content }: MarkdownProps) => (
  <ReactMarkdown components={components} remarkPlugins={[remarkUnwrapImages]}>
    {content}
  </ReactMarkdown>
);
