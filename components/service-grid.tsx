import Link from "next/link";
import type { Service } from "@/content/types";

export function ServiceGrid({
  items,
  detailed = false,
}: {
  items: Service[];
  detailed?: boolean;
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => {
        const number = String(index + 1).padStart(2, "0");
        const className =
          "group flex h-full flex-col justify-center rounded-[1.6rem] border-2 border-motion-lime px-5 py-5 text-white transition-colors duration-300 hover:bg-motion-lime hover:text-black focus-visible:bg-motion-lime focus-visible:text-black sm:px-6 sm:py-6";

        const body = (
          <>
            <span className="font-display text-xs tracking-[0.18em] text-motion-lime transition-colors group-hover:text-black group-focus-visible:text-black">
              {number}
            </span>
            <span className="mt-3 text-xl font-bold leading-tight sm:text-2xl">
              {item.name}
            </span>
            {detailed ? (
              <span className="mt-3 text-sm leading-relaxed text-white/75 transition-colors group-hover:text-black/75 group-focus-visible:text-black/75">
                {item.summary}
              </span>
            ) : null}
          </>
        );

        return (
          <li key={item.id} id={item.id} className="scroll-mt-28">
            {detailed ? (
              <article className={className}>{body}</article>
            ) : (
              <Link href={`/services#${item.id}`} className={className}>
                {body}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
