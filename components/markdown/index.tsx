import ReactMarkdown from "react-markdown";
import type { NormalComponents } from "react-markdown/lib/complex-types";
import type { SpecialComponents } from "react-markdown/lib/ast-to-react";
import { H1 } from "./h1";
import { P } from "./p";
import { A } from "./a";

type Components = Omit<NormalComponents, keyof SpecialComponents> &
  SpecialComponents;

const components: Partial<Components> = {
  h1: H1,
  p: P,
  a: A,
};

interface MarkdownProps {
  content: string;
}

export const Markdown = ({ content }: MarkdownProps) => (
  <ReactMarkdown components={components}>{content}</ReactMarkdown>
);
