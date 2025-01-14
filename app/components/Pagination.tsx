import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  pageLimit: number;
  totalCount: number;
  pathName: string;
}

export const Paginations = ({
  currentPage,
  totalCount,
  pathName,
  pageLimit,
}: PaginationProps) => {
  return (
    <ul className="flex justify-between items-center text-sm mt-8">
      <li>
        {currentPage > 1 && (
          <Link
            href={{
              query: {
                page: currentPage - 1,
                pageSize: pageLimit,
              },
            }}
          >
            <span className="flex items-center gap-1">
              <ChevronLeft className="w-5 h-5" /> Previous
            </span>
          </Link>
        )}
        {currentPage <= 1 && (
          <span className=" text-zinc-400 flex items-center gap-1">
            <ChevronLeft className="w-5 h-5" /> Previous
          </span>
        )}
      </li>
      {typeof totalCount === "number" && (
        <li className="flex-grow flex justify-center">
          <ul className="flex items-center gap-3">
            {[...new Array(Math.ceil(totalCount / pageLimit))].map(
              (_, index) => {
                const page = index + 1;
                return (
                  <li key={page}>
                    <Button
                      variant={page === currentPage ? "default" : "outline"}
                      asChild
                      size="sm"
                      className="h-auto px-2.5 py-1"
                    >
                      <Link
                        href={{
                          pathname: pathName,
                          query: {
                            page,
                            pageSize: pageLimit,
                          },
                        }}
                      >
                        {page}
                      </Link>
                    </Button>
                  </li>
                );
              }
            )}
          </ul>
        </li>
      )}
      <li>
        {currentPage < Math.ceil(totalCount / pageLimit) && (
          <Link
            href={{
              query: {
                page: currentPage + 1,
                pageSize: pageLimit,
              },
            }}
          >
            <span className="flex items-center gap-1">
              Next <ChevronRight className="w-5 h-5" />
            </span>
          </Link>
        )}
        {currentPage >= Math.ceil(totalCount / pageLimit) && (
          <span className=" text-zinc-400 flex items-center gap-1">
            Next <ChevronRight className="w-5 h-5" />
          </span>
        )}
      </li>
    </ul>
  );
};
