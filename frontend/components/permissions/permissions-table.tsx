"use client";

import { useState } from "react";
import { Permission } from "@/types/permission";
import { Button } from "@/components/ui/button";
import { deletePermission } from "@/app/admin/(protected)/permissions/actions";
import { PermissionFormModal } from "./permission-form-modal";

export function PermissionsTable({
  initialData,
}: {
  initialData: Permission[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Permission | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(permission: Permission) {
    setEditing(permission);
    setModalOpen(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Xoá permission này? Hành động không thể hoàn tác.")) return;
    setDeletingId(id);
    const result = await deletePermission(id);
    setDeletingId(null);
    if (!result.success) alert(result.message);
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}>+ Thêm permission</Button>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-content)] text-[var(--text-muted)] text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Module</th>
              <th className="px-4 py-3 font-medium">Mô tả</th>
              <th className="px-4 py-3 font-medium w-32"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {initialData.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-mono text-xs">{p.name}</td>
                <td className="px-4 py-3">
                  <span className="inline-block rounded-full bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 text-xs font-medium">
                    {p.module}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--text-muted)]">
                  {p.description ?? "—"}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="text-[var(--accent)] hover:underline text-xs"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="text-red-600 hover:underline text-xs disabled:opacity-50"
                  >
                    {deletingId === p.id ? "Đang xoá..." : "Xoá"}
                  </button>
                </td>
              </tr>
            ))}
            {initialData.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-[var(--text-muted)]"
                >
                  Chưa có permission nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <PermissionFormModal
          permission={editing}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
