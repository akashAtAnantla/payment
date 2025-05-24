// components/dashboard/merchant-connections-client.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import ConnectionsClient from "@/components/connections/connections-client";
import { useToast } from "@/hooks/use-toast";

export default function MerchantConnectionsClient({
  merchantId,
}: {
  merchantId: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { merchants } = useAppSelector((state) => state.merchants);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (user.role !== "superAdmin") {
      toast({
        title: "Access Denied",
        description:
          "Only Super Admins can access merchant-specific connections.",
        variant: "destructive",
      });
      router.push("/connections");
      return;
    }

    const merchantExists = merchants.some((m) => m.id === merchantId);
    if (!merchantExists) {
      toast({
        title: "Merchant Not Found",
        description: `No merchant found with ID: ${merchantId}`,
        variant: "destructive",
      });
      router.push("/merchants");
      return;
    }
  }, [merchantId, merchants, router, toast, user]);

  if (
    !user ||
    user.role !== "superAdmin" ||
    !merchants.some((m) => m.id === merchantId)
  ) {
    return null;
  }

  return <ConnectionsClient isSuperAdminView={false} merchantId={merchantId} />;
}
