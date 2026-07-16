"use client";

import { useState } from "react";
import { Media } from "@/types/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  updateMediaAction,
  deleteMediaAction,
} from "@/app/admin/(protected)/media/actions";

export function MediaDetailModal({
  media,
  open,
  onClose,
}: {
  media: Media;
  open: boolean;
  onClose: () => void;
}) {
  const [altText, setAltText] = useState(media.altText ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateMediaAction(media.id, { altText });
    setSaving(false);
    onClose();
  }

  async function handleDelete() {
    if (!confirm("Xoá file này? Hành động không thể hoàn tác.")) return;
    setDeleting(true);
    await deleteMediaAction(media.id);
    setDeleting(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{media.fileName}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 pt-2">
          <div className="w-1/2 aspect-square bg-[var(--bg-content)] rounded-lg flex items-center justify-center overflow-hidden">
            {media.mimeType.startsWith("image/") ? (
              <img
                src={media.url}
                alt={media.altText ?? ""}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <p className="text-sm text-[var(--text-muted)] p-4">
                {media.fileName}
              </p>
            )}
          </div>

          <div className="w-1/2 space-y-4">
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {media.width && media.height
                ? `${media.width} × ${media.height} px`
                : media.mimeType}{" "}
              — {(media.size / 1024).toFixed(0)} KB
            </p>

            <Input
              label="Alt text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Mô tả ảnh cho SEO..."
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Đang xoá..." : "Xoá"}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
