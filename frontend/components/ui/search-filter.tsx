"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useQueryParams } from "@/lib/hooks/use-query-params";
import { DEFAULT_PAGE } from "@/lib/constants/pagination";

interface FilterField {
  key: string;
  placeholder: string;
}

interface SearchFilterProps {
  fields: FilterField[];
}

export function SearchFilter({ fields }: SearchFilterProps) {
  const { setParams, getParam, isPending } = useQueryParams();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, getParam(f.key)])),
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParams({ ...values, page: DEFAULT_PAGE });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-4 max-w-lg">
      {fields.map((field) => (
        <Input
          key={field.key}
          placeholder={field.placeholder}
          value={values[field.key] ?? ""}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
          }
        />
      ))}
      <button
        type="submit"
        disabled={isPending}
        className="shrink-0 rounded-lg bg-[var(--accent)] text-white text-sm px-4 disabled:opacity-60"
      >
        {isPending ? "..." : "Tìm"}
      </button>
    </form>
  );
}
