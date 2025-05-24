// components/layout/header.tsx
"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppSelector } from "@/lib/redux/hooks";
import { usePathname } from "next/navigation";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Header({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: HeaderProps) {
  const { user } = useAppSelector((state) => state.auth);
  const pathname = usePathname();

  const pageTitle = (() => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/merchants") return "Merchants";
    if (pathname === "/connections") return "Payment Gateways";
    if (pathname.includes("/dashboard/") && pathname.includes("/connections"))
      return "Connections";
    if (pathname.includes("/dashboard/")) return "Merchant Dashboard";
    if (pathname === "/profile") return "Profile";
    return "Payment Orchestration";
  })();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
