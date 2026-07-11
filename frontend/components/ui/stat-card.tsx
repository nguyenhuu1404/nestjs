export function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-5">
      <p className="text-sm text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-3xl font-mono font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}
