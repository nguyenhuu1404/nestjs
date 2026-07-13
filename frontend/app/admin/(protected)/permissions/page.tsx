import { requireToken } from "@/lib/session";
import { permissionsApi } from "@/lib/api/permissions";
import { PermissionsTable } from "@/components/permissions/permissions-table";
import { SearchFilter } from "@/components/ui/search-filter";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants/pagination";

interface PageProps {
  searchParams: Promise<{ page?: string; name?: string; module?: string }>;
}

export default async function PermissionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = await requireToken();
  const { items, meta } = await permissionsApi.findAllPaginated(
    {
      page: params.page ? Number(params.page) : DEFAULT_PAGE,
      limit: DEFAULT_PAGE_SIZE,
      name: params.name,
      module: params.module,
    },
    token,
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
            Quyền hạn
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Quản lý permission theo module
          </p>
        </div>
      </div>

      <SearchFilter
        fields={[
          { key: "name", placeholder: "Tìm theo name..." },
          { key: "module", placeholder: "Tìm theo module..." },
        ]}
      />

      <PermissionsTable initialData={items} meta={meta} />
    </div>
  );
}
