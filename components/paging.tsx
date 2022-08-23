import classnames from "classnames";
import Link from "next/link";

interface PagingProperties {
  totalPages: number;
  pageNo: number;
  getPageLink: (pageNo: number) => string;
}

export const Paging = ({
  totalPages,
  pageNo,
  getPageLink
}: PagingProperties) => (
  <div className="mt-4 flex gap-1 overflow-x-scroll no-scrollbar">
    {Array.from({ length: totalPages }, (_, index) => {
      const key = index + 1;
      return (
        <Link key={key} href={getPageLink(key)}>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- href provided by Link */}
          <a
            className={classnames(
              "px-3 py-1 rounded-md text-sm font-bold",
              key === pageNo ? "bg-orange" : "bg-yellow",
              {
                "ml-auto": key === 1,
                "mr-auto": key === totalPages
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
