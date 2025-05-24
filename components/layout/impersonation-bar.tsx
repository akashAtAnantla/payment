// components/layout/impersonation-bar.tsx
"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { clearMerchantContext } from "@/lib/redux/features/auth-slice";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLoading } from "@/components/loading-provider";

export default function ImpersonationBar({
  merchantName,
  merchantId,
}: {
  merchantName: string;
  merchantId: string;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { setLoading } = useLoading();
  const { user, currentMerchantContext } = useAppSelector(
    (state) => state.auth
  );

  if (user?.role !== "superAdmin" || !currentMerchantContext) {
    return null;
  }

  const handleExitImpersonation = async () => {
    setLoading(true);
    try {
      dispatch(clearMerchantContext());
      router.push("/dashboard");
      toast({
        title: "Exited Impersonation",
        description: `Returned to Super Admin dashboard.`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-blue-50 dark:bg-blue-900 border-b border-blue-500 px-6 py-3 flex items-center justify-between">
      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
        Super Admin Mode: Impersonating Merchant{" "}
        <span className="font-bold">
          {merchantName} (ID: {merchantId})
        </span>
        . Press{" "}
        <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
          Esc
        </kbd>{" "}
        to return.
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExitImpersonation}
        className="border-blue-500 text-blue-700 dark:text-blue-200"
      >
        Return to Super Admin Dashboard
      </Button>
    </div>
  );
}
