import Link from "next/link";

type PaginationProps = { currentPage?: number; totalPages?: number; query?: string };

export function Pagination({ currentPage = 1, totalPages = 4, query = "" }: PaginationProps) {
  return (
    <nav aria-label="Products pagination" className="py-8 text-lg font-medium">
      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          const pageQuery = [`page=${page}`, query].filter(Boolean).join("&");
          return page === currentPage ? <span aria-current="page" className="mx-1 inline-block cursor-default rounded px-3 py-2 text-brand-purple" key={page}>{page}</span> : <Link className="mx-1 inline-block rounded px-3 py-2 text-brand-dark transition-colors hover:text-brand-purple" href={`/products?${pageQuery}`} key={page}>{page}</Link>;
        })}
      </div>
    </nav>
  );
}
