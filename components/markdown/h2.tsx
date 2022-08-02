import type { SpecialComponents } from "react-markdown/lib/ast-to-react";

export const H2: SpecialComponents["h2"] = ({ children }) => (
  <h2 className="mt-4 text-2xl font-bold">{children}</h2>
);
