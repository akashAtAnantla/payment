// app/(dashboard)/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import SuperAdminDashboard from "@/components/dashboard/super-admin-dashboard";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the dashboard.",
        variant: "destructive",
      });
      router.push("/login");
    } else if (user.role === "merchantAdmin" && user.merchantId) {
      router.push(`/dashboard/${user.merchantId}`);
    }
  }, [user, router, toast]);

  if (!user) {
    return null;
  }

  if (user.role === "merchantAdmin") {
    return null; // Redirect handled in useEffect
  }

  if (user.role !== "superAdmin") {
    return null;
  }

  return <SuperAdminDashboard />;
}
