// app/(dashboard)/merchants/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import MerchantsClient from "@/components/merchants/merchants-client";

export default async function MerchantsPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "superAdmin") {
    redirect(`/dashboard/${user.merchantId}`);
  }

  return (
    <div>
      <MerchantsClient />
    </div>
  );
}
