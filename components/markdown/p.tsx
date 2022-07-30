import type { NormalComponents } from "react-markdown/lib/complex-types";

export const P: NormalComponents["p"] = ({ children }) => (
  <p className="mt-4">{children}</p>
);
