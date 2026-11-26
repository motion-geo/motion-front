export function SectionLabel({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "brand" | "band";
}) {
  const color =
    tone === "brand"
      ? "text-brand"
      : tone === "band"
        ? "text-band-fg"
        : "text-accent";

  return (
    <div className={color}>
      <span className="text-sm font-bold uppercase tracking-[0.18em] sm:text-base">
        {children}
      </span>
    </div>
  );
}
