import { requireToken } from "@/lib/session";
import { usersApi } from "@/lib/api/users";
import { rolesApi } from "@/lib/api/roles";
import { StatCard } from "@/components/ui/stat-card";

export default async function DashboardPage() {
  const token = await requireToken();
  const [users, roles] = await Promise.all([
    usersApi.findAll(token),
    rolesApi.findAll(token),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-1">
        Tổng quan
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">
        Trạng thái hệ thống hiện tại
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <StatCard label="Người dùng" value={users.length} />
        <StatCard label="Vai trò" value={roles.length} />
      </div>
    </div>
  );
}
