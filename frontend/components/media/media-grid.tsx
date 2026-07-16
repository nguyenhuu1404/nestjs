"use client";

import { useState } from "react";
import { Media } from "@/types/media";
import { MediaDetailModal } from "./media-detail-modal";

export function MediaGrid({ items }: { items: Media[] }) {
  const [selected, setSelected] = useState<Media | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map((media) => (
          <button
            key={media.id}
            onClick={() => setSelected(media)}
            className="aspect-square rounded-lg cursor-pointer border border-[var(--border)] overflow-hidden bg-[var(--bg-content)] hover:ring-2 hover:ring-[var(--accent)] transition-all"
          >
            {media.mimeType.startsWith("image/") ? (
              <img
                src={media.url}
                alt={media.altText ?? media.fileName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-muted)] font-mono p-2 text-center">
                {media.fileName}
              </div>
            )}
          </button>
        ))}
        {items.length === 0 && (
          <p className="col-span-full text-center text-sm text-[var(--text-muted)] py-12">
            Chưa có file nào
          </p>
        )}
      </div>

      {selected && (
        <MediaDetailModal
          media={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
