import { BatchSelector } from "./batch-selector";

export function ClientPageHeader({ eyebrow, title, description, batches, selectedBatch }: { eyebrow: string; title: string; description: string; batches?: string[]; selectedBatch?: string }) {
  return <header className="app-header page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">{description}</p></div>{batches && selectedBatch ? <BatchSelector batches={batches} selectedBatch={selectedBatch} /> : null}</header>;
}
