import { requireToken } from "@/lib/session";
import { mediaApi } from "@/lib/api/media";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaUploadButton } from "@/components/media/media-upload-button";
import { SearchFilter } from "@/components/ui/search-filter";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import { DEFAULT_PAGE } from "@/lib/constants/pagination";

interface PageProps {
  searchParams: Promise<{ page?: string; fileName?: string }>;
}

export default async function MediaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = await requireToken();

  const { items, meta } = await mediaApi.findAllPaginated(
    {
      page: params.page ? Number(params.page) : DEFAULT_PAGE,
      limit: 24,
      fileName: params.fileName,
    },
    token,
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Thư viện Media
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Quản lý ảnh và tệp tin đã tải lên
          </p>
        </div>
        <MediaUploadButton folder="media" />
      </div>

      <SearchFilter
        fields={[{ key: "fileName", placeholder: "Tìm theo tên file..." }]}
      />
      <MediaGrid items={items} />
      <PaginationWrapper meta={meta} />
    </div>
  );
}
