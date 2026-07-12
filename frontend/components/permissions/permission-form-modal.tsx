"use client";

import { useState } from "react";
import { Permission } from "@/types/permission";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  createPermission,
  updatePermission,
} from "@/app/admin/(protected)/permissions/actions";

interface Props {
  permission: Permission | null; // null = tạo mới, có giá trị = đang sửa
  onClose: () => void;
}

export function PermissionFormModal({ permission, onClose }: Props) {
  const isEdit = !!permission;
  const [name, setName] = useState(permission?.name ?? "");
  const [module, setModule] = useState(permission?.module ?? "");
  const [description, setDescription] = useState(permission?.description ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = isEdit
      ? await updatePermission(permission.id, { name, module, description })
      : await createPermission({ name, module, description });

    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          {isEdit ? "Sửa permission" : "Thêm permission"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name (module.action)"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="orders.view"
          />
          <Input
            label="Module"
            required
            value={module}
            onChange={(e) => setModule(e.target.value)}
            placeholder="orders"
          />
          <Input
            label="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuỳ chọn"
          />

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="!text-[var(--text-primary)]"
            >
              Huỷ
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
