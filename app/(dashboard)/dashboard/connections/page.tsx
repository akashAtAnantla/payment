// app/(dashboard)/dashboard/connections/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import ConnectionsClient from "@/components/connections/connections-client";

export default async function SuperAdminConnectionsPage() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "superAdmin") {
    redirect(`/dashboard/${user.merchantId}/connections`);
  }

  return (
    <div>
      <ConnectionsClient isSuperAdminView={true} />
    </div>
  );
}
