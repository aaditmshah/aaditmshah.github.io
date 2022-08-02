import type { SpecialComponents } from "react-markdown/lib/ast-to-react";

export const UL: SpecialComponents["ul"] = ({ children }) => (
  <ul className="mt-4 list-disc list-inside">{children}</ul>
);
