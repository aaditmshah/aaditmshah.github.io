import classNames from "classnames";
import Link from "next/link";

export interface MetaDataProps {
  published: number;
  modified: number;
  tags: string[];
}

const dateTime = (time: number) => {
  const date = new Date(time);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return (
    <time dateTime={date.toISOString()}>
      {String(year).padStart(4, "0")}-{String(month).padStart(2, "0")}-
      {String(day).padStart(2, "0")}
    </time>
  );
};

const tagLink = (tag: string) => (
  <Link href={`/blog/tags/${tag}/page/1`}>
    <a className="text-orange font-bold">{tag}</a>
  </Link>
);

export const MetaData = ({ published, modified, tags }: MetaDataProps) => {
  const lastTagIndex = tags.length - 1;

  if (lastTagIndex < 0) throw new Error("no tags");

  const metadata = {
    "First Published": dateTime(published),
    "Last Modified": dateTime(modified),
  };

  return (
    <dl className="mt-2 flex flex-wrap gap-x-4 text-sm">
      {Object.entries(metadata).map(([key, value]) => (
        <div key={key} className="flex">
          <dt className="font-bold after:content-[':\00A0']">{key}</dt>
          <dd>{value}</dd>
        </div>
      ))}
      <div className="flex flex-wrap">
        <dt className="font-bold after:content-[':\00A0'] after:last:content-none">
          Tags
        </dt>
        {tags.map((tag, index) =>
          index < lastTagIndex ? (
            <dd key={tag} className="after:content-[',\00A0']">
              {tagLink(tag)}
            </dd>
          ) : (
            <dd key={tag}>{tagLink(tag)}</dd>
          )
        )}
      </div>
    </dl>
  );
};
