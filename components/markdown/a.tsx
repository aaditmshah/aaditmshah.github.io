import type { NormalComponents } from "react-markdown/lib/complex-types";

export const A: NormalComponents["a"] = ({ href, children }) => (
  <a href={href} className="text-orange font-bold">
    {children}
  </a>
);
