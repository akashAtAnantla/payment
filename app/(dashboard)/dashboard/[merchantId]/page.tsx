// app/(dashboard)/dashboard/[merchantId]/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import MerchantAdminDashboard from "@/components/dashboard/merchant-admin-dashboard";
import BreadcrumbsDynamic from "@/components/ui/breadcrumbs-dynamic";
import { getMerchants } from "@/lib/redux/features/merchants-slice";

export async function generateStaticParams() {
  const merchants = getMerchants();
  return merchants.map((merchant) => ({
    merchantId: merchant.id,
  }));
}

export default async function MerchantDashboardPage({
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
    redirect(`/dashboard/${user.merchantId}`);
  }

  return (
    <div>
      <BreadcrumbsDynamic />
      <MerchantAdminDashboard merchantId={params.merchantId} />
    </div>
  );
}
