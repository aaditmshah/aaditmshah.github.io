import path from "path";
import { promises as fs } from "fs";
import type { NextPage, GetStaticProps } from "next";
import { Markdown } from "../components";

interface SponsorProps {
  content: string;
}

const Sponsor: NextPage<SponsorProps> = ({ content }) => {
  return (
    <div className="h-full flex justify-center items-center">
      <article className="max-w-2xl px-8 py-8 sm:px-4">
        <Markdown content={content} />
      </article>
    </div>
  );
};

export const getStaticProps: GetStaticProps<SponsorProps> = async () => {
  const fileName = path.join(process.cwd(), "content/sponsor.md");
  const content = await fs.readFile(fileName, "utf8");
  return { props: { content } };
};

export default Sponsor;
