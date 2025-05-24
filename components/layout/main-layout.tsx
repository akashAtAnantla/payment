// components/layout/main-layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setMerchantContext } from "@/lib/redux/features/auth-slice";
import Sidebar from "./sidebar";
import Header from "./header";
import { Toaster } from "@/components/ui/toaster";
import { getMerchants } from "@/lib/redux/features/merchants-slice";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, currentMerchantContext } = useAppSelector(
    (state) => state.auth
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Handle Escape key to exit impersonation mode
  useEffect(() => {
    if (
      !isMounted ||
      !user ||
      user.role !== "superAdmin" ||
      !currentMerchantContext
    ) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setMerchantContext(""));
        router.push("/dashboard");
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMounted, user, currentMerchantContext, dispatch, router]);

  if (!isMounted || !user) {
    return null;
  }

  const isImpersonationMode =
    user.role === "superAdmin" && !!currentMerchantContext;
  const merchants = getMerchants();
  const merchant = merchants.find((m) => m.id === currentMerchantContext);

  console.log("MainLayout rendered");

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {isImpersonationMode && merchant && (
            <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 mb-6 rounded max-w-7xl mx-auto">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Impersonating merchant:{" "}
                <span className="font-bold">
                  {merchant.name} (ID: {merchant.id})
                </span>
              </p>
            </div>
          )}
          <div className="max-w-7xl mx-auto">
            <Toaster />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
