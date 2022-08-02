import path from "path";
import { promises as fs } from "fs";
import type { NextPage, GetStaticProps } from "next";
import { Markdown } from "../components";

interface PatronsProps {
  content: string;
}

const Patrons: NextPage<PatronsProps> = ({ content }) => {
  return (
    <div className="h-full flex justify-center items-center">
      <article className="max-w-2xl px-8 py-8 sm:px-4">
        <Markdown content={content} />
      </article>
    </div>
  );
};

export const getStaticProps: GetStaticProps<PatronsProps> = async () => {
  const fileName = path.join(process.cwd(), "content/patrons.md");
  const content = await fs.readFile(fileName, "utf8");
  return { props: { content } };
};

export default Patrons;
