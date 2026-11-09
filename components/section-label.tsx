export function SectionLabel({
  index,
  children,
  tone = "lime",
}: {
  index?: string;
  children: React.ReactNode;
  tone?: "lime" | "green" | "black";
}) {
  const color =
    tone === "green"
      ? "text-motion-green"
      : tone === "black"
        ? "text-black"
        : "text-motion-lime";

  return (
    <div className={`flex items-center gap-3 ${color}`}>
      {index ? (
        <span className="font-display text-sm tracking-[0.22em]">{index}</span>
      ) : null}
      <span className="text-xs font-bold uppercase tracking-[0.2em]">
        {children}
      </span>
    </div>
  );
}

export function SampleBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-current px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">
      {label}
    </span>
  );
}
