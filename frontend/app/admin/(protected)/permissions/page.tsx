import { requireToken } from "@/lib/session";
import { permissionsApi } from "@/lib/api/permissions";
import { PermissionsTable } from "@/components/permissions/permissions-table";

export default async function PermissionsPage() {
  const token = await requireToken();
  const permissions = await permissionsApi.findAll(token);

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

      <PermissionsTable initialData={permissions} />
    </div>
  );
}
