import classNames from "classnames";
import Link from "next/link";

interface PagingProps {
  totalPages: number;
  pageNo: number;
  getPageLink: (pageNo: number) => string;
}

export const Paging = ({ totalPages, pageNo, getPageLink }: PagingProps) => {
  return (
    <div className="mt-4 flex gap-1 overflow-x-scroll no-scrollbar">
      {Array.from({ length: totalPages }, (_, i) => {
        const key = i + 1;
        return (
          <Link key={key} href={getPageLink(key)}>
            <a
              className={classNames(
                "px-3 py-1 rounded-md text-sm font-bold",
                key === pageNo ? "bg-orange" : "bg-yellow",
                {
                  "ml-auto": key === 1,
                  "mr-auto": key === totalPages,
                }
              )}
            >
              {key}
            </a>
          </Link>
        );
      })}
    </div>
  );
};
