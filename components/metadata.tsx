import Link from "next/link";

interface MetaDataProperties {
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
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- href provided by Link */}
    <a className="text-orange font-bold">{tag}</a>
  </Link>
);

export const MetaData = ({ published, modified, tags }: MetaDataProperties) => {
  const lastTagIndex = tags.length - 1;

  if (lastTagIndex < 0) throw new Error("no tags");

  return (
    <dl className="mt-2 flex flex-wrap gap-x-4 text-sm">
      <div className="flex">
        {/* eslint-disable-next-line no-octal-escape -- Tailwind Unicode Escape */}
        <dt className="font-bold after:content-[':\00A0']">First Published</dt>
        <dd>{dateTime(published)}</dd>
      </div>
      <div className="flex">
        {/* eslint-disable-next-line no-octal-escape -- Tailwind Unicode Escape */}
        <dt className="font-bold after:content-[':\00A0']">Last Modified</dt>
        <dd>{dateTime(modified)}</dd>
      </div>
      <div className="flex flex-wrap">
        {/* eslint-disable-next-line no-octal-escape -- Tailwind Unicode Escape */}
        <dt className="font-bold after:content-[':\00A0'] after:last:content-none">
          Tags
        </dt>
        {tags.map((tag, index) =>
          index < lastTagIndex ? (
            /* eslint-disable-next-line no-octal-escape -- Tailwind Unicode Escape */
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

export type { MetaDataProperties };
