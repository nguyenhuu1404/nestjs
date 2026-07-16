"use client";

import { Pagination } from "@/components/ui/pagination";
import { useQueryParams } from "@/lib/hooks/use-query-params";
import { PaginationMeta } from "@/types/pagination";

export function PaginationWrapper({ meta }: { meta: PaginationMeta }) {
  const { setParams } = useQueryParams();
  return (
    <Pagination meta={meta} onPageChange={(page) => setParams({ page })} />
  );
}
