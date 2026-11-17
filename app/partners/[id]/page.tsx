import { Suspense } from "react";
import { PartnerDetailPage } from "@/components/partner-detail-page";
import { ka } from "@/content/ka";

export function generateStaticParams() {
  return ka.partners.items.map((partner) => ({ id: partner.id }));
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<PartnerDetailFallback />}>
      <PartnerDetail params={params} />
    </Suspense>
  );
}

async function PartnerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PartnerDetailPage partnerId={id} />;
}

function PartnerDetailFallback() {
  return (
    <div className="bg-page text-page-fg">
      <div className="shell animate-pulse py-14 md:py-20">
        <div className="h-4 w-40 rounded bg-soft" />
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="min-h-[18rem] rounded-[1.8rem] bg-soft sm:min-h-[22rem]" />
          <div className="min-h-[18rem] rounded-[1.8rem] bg-soft sm:min-h-[22rem]" />
        </div>
        <div className="mt-12 h-4 w-32 rounded bg-soft" />
        <div className="mt-5 flex gap-2">
          <div className="h-9 w-24 rounded-full bg-soft" />
          <div className="h-9 w-24 rounded-full bg-soft" />
          <div className="h-9 w-28 rounded-full bg-soft" />
        </div>
      </div>
    </div>
  );
}
