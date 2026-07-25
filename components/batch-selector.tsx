"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function BatchSelector({ batches, selectedBatch }: { batches: string[]; selectedBatch: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return <label className="batch-selector"><span>复查批次</span><select value={selectedBatch} onChange={(event) => { const params = new URLSearchParams(searchParams.toString()); params.set("batch", event.target.value); router.replace(`${pathname}?${params.toString()}`); }}>{batches.map((batch) => <option key={batch} value={batch}>{batch}</option>)}</select></label>;
}
