"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { mediaApi } from "@/lib/api/media";

export function MediaUploadButton({ folder = "media" }: { folder?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await mediaApi.upload(file, folder);
      router.refresh();
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={handleChange}
        accept="image/*,.pdf"
      />
      <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
        {uploading ? "Đang tải lên..." : "+ Tải file lên"}
      </Button>
    </>
  );
}
