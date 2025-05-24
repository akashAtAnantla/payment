// components/dashboard/merchant-dashboard-client.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setMerchantContext } from "@/lib/redux/features/auth-slice";
import MerchantAdminDashboard from "@/components/dashboard/merchant-admin-dashboard";
import { useToast } from "@/hooks/use-toast";

export default function MerchantDashboardClient({
  merchantId,
}: {
  merchantId: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user, currentMerchantContext } = useAppSelector(
    (state) => state.auth
  );
  const { merchants } = useAppSelector((state) => state.merchants);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the dashboard.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    const merchantExists = merchants.some((m) => m.id === merchantId);
    if (!merchantExists) {
      toast({
        title: "Merchant Not Found",
        description: `No merchant found with ID: ${merchantId}`,
        variant: "destructive",
      });
      router.push(user.role === "superAdmin" ? "/merchants" : "/dashboard");
      return;
    }

    if (user.role === "merchantAdmin" && user.merchantId !== merchantId) {
      toast({
        title: "Access Denied",
        description: "You can only view your own merchant dashboard.",
        variant: "destructive",
      });
      router.push(`/dashboard/${user.merchantId}`);
      return;
    }

    if (user.role === "superAdmin" && currentMerchantContext !== merchantId) {
      dispatch(setMerchantContext(merchantId));
      toast({
        title: "Impersonation Mode",
        description: `Now managing merchant ID: ${merchantId}`,
      });
    }
  }, [
    dispatch,
    merchantId,
    merchants,
    router,
    user,
    currentMerchantContext,
    toast,
  ]);

  if (!user || !merchants.some((m) => m.id === merchantId)) {
    return null;
  }

  if (user.role === "merchantAdmin" && user.merchantId !== merchantId) {
    return null;
  }

  return <MerchantAdminDashboard merchantId={merchantId} />;
}
