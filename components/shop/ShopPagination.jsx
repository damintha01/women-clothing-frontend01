"use client";

export function ShopPagination({ page, totalPages, setFilters }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-16 flex items-center justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => setFilters({ page: page - 1 })}
        className="border border-border px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-30"
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setFilters({ page: p })}
          className={`size-9 text-sm transition-colors duration-500 ${
            p === page ? "bg-foreground text-cream" : "hover:bg-secondary"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => setFilters({ page: page + 1 })}
        className="border border-border px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
}
