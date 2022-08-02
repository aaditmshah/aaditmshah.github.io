import type { NormalComponents } from "react-markdown/lib/complex-types";
import Link from "next/link";

const absolutePath = /^\//;

export const A: NormalComponents["a"] = ({ href = "", children }) =>
  absolutePath.test(href) ? (
    <Link href={href}>
      <a className="text-orange font-bold">{children}</a>
    </Link>
  ) : (
    <a href={href} className="text-orange font-bold">
      {children}
    </a>
  );
