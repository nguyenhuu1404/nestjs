import { PaginationMeta } from "@/types/pagination";
import { MAX_VISIBLE_PAGES } from "@/lib/constants/pagination";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  maxVisible?: number; // số nút trang tối đa hiển thị cùng lúc, mặc định 10
}

function getVisiblePages(
  current: number,
  total: number,
  maxVisible: number,
): (number | "ellipsis")[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, current - half);
  let end = Math.min(total, start + maxVisible - 1);

  // Nếu đang ở gần cuối, dịch ngược lại để luôn đủ maxVisible nút
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages: (number | "ellipsis")[] = [];
  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("ellipsis");
  }
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total) {
    if (end < total - 1) pages.push("ellipsis");
    pages.push(total);
  }

  return pages;
}

export function Pagination({
  meta,
  onPageChange,
  maxVisible = MAX_VISIBLE_PAGES,
}: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  const pages = getVisiblePages(meta.page, meta.totalPages, maxVisible);

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-xs text-[var(--text-muted)]">
        Trang {meta.page}/{meta.totalPages} — {meta.total} bản ghi
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs disabled:opacity-40 hover:bg-[var(--bg-content)] transition-colors"
        >
          Trước
        </button>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-1.5 text-xs text-[var(--text-muted)]"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[28px] rounded-lg px-2 py-1.5 text-xs transition-colors ${
                p === meta.page
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] hover:bg-[var(--bg-content)]"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs disabled:opacity-40 hover:bg-[var(--bg-content)] transition-colors"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
