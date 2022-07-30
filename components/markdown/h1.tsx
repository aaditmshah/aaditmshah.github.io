import type { SpecialComponents } from "react-markdown/lib/ast-to-react";
import Head from "next/head";

export const H1: SpecialComponents["h1"] = ({ children }) => (
  <header>
    <Head>
      <title>{`${children} - Aadit M Shah`}</title>
    </Head>
    <h1 className="text-3xl font-bold">{children}</h1>
  </header>
);
