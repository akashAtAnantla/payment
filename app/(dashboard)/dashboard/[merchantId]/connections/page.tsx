// app/(dashboard)/dashboard/[merchantId]/connections/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import ConnectionsClient from "@/components/connections/connections-client";
import { getMerchants } from "@/lib/redux/features/merchants-slice";

// Static params for SSG
export async function generateStaticParams() {
  const merchants = getMerchants();
  return merchants.map((merchant) => ({
    merchantId: merchant.id,
  }));
}

export default async function ConnectionsPage({
  params,
}: {
  params: { merchantId: string };
}) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  if (user.role === "merchantAdmin" && user.merchantId !== params.merchantId) {
    redirect(`/dashboard/${user.merchantId}/connections`);
  }

  return (
    <div>
      <ConnectionsClient
        isSuperAdminView={false}
        merchantId={params.merchantId}
      />
    </div>
  );
}
