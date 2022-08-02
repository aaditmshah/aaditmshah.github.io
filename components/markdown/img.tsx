import type { NormalComponents } from "react-markdown/lib/complex-types";
import Image from "next/image";
import { assets } from "../../assets";

const assetFormat = /^(\w+)-(\d+)x(\d+)(-priority)?$/;

export const Img: NormalComponents["img"] = ({ src = "", alt }) => {
  const result = assetFormat.exec(src);

  if (result === null) throw new Error("asset format invalid");

  const asset = assets[result[1] || ""] || "";
  const width = Number.parseInt(result[2] || "", 10);
  const height = Number.parseInt(result[3] || "", 10);
  const priority = result[4] === "-priority";

  return (
    <figure className="mt-4 text-center">
      <Image
        src={asset}
        alt=""
        width={width}
        height={height}
        quality={100}
        layout="fixed"
        priority={priority}
      />
      <figcaption>{alt}</figcaption>
    </figure>
  );
};
