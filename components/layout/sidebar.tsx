// components/layout/sidebar.tsx
"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/features/auth-slice";
import Link from "next/link";
import { Home, Users, Link2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const NavLink = ({ href, icon, label, onClick }: NavLinkProps) => {
  return (
    <Link href={href} onClick={onClick}>
      <Button variant="ghost" className="w-full justify-start text-left">
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
};

export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { user, currentMerchantContext } = useAppSelector(
    (state) => state.auth
  );
  const { merchants } = useAppSelector((state) => state.merchants);
  const isSuperAdmin = user?.role === "superAdmin";
  const isImpersonationMode = isSuperAdmin && !!currentMerchantContext;
  const currentMerchant = merchants.find(
    (m) => m.id === currentMerchantContext
  );
  const effectiveMerchantId = isImpersonationMode
    ? currentMerchantContext
    : user?.merchantId;

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push("/login");
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 space-y-6 py-4 px-2 absolute inset-y-0 left-0 transform flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30"
      )}
    >
      <div className="flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Navigation</h2>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <span className="sr-only">Close menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
      <nav className="space-y-1 px-2 flex-1">
        {isSuperAdmin && !isImpersonationMode && (
          <>
            <NavLink
              href="/dashboard"
              icon={<Home className="h-5 w-5" />}
              label="Dashboard"
            />
            <NavLink
              href="/dashboard/connections"
              icon={<Link2 className="h-5 w-5" />}
              label="Payment Gateways"
            />
            <NavLink
              href="/merchants"
              icon={<Users className="h-5 w-5" />}
              label="Merchants"
            />
            {currentMerchantContext && (
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="w-full text-left px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                  Merchant: {currentMerchant?.name || "Unknown"}
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-4 space-y-1">
                  <NavLink
                    href={`/dashboard/${currentMerchantContext}`}
                    icon={<Home className="h-5 w-5" />}
                    label="Merchant Dashboard"
                  />
                  <NavLink
                    href={`/dashboard/${currentMerchantContext}/connections`}
                    icon={<Link2 className="h-5 w-5" />}
                    label="Connections"
                  />
                </CollapsibleContent>
              </Collapsible>
            )}
          </>
        )}
        {(isImpersonationMode || (!isSuperAdmin && user?.merchantId)) &&
          effectiveMerchantId && (
            <>
              <NavLink
                href={`/dashboard/${effectiveMerchantId}`}
                icon={<Home className="h-5 w-5" />}
                label="Dashboard"
              />
              <NavLink
                href={`/dashboard/${effectiveMerchantId}/connections`}
                icon={<Link2 className="h-5 w-5" />}
                label="Connections"
              />
            </>
          )}
      </nav>
      <div className="mt-auto px-4 space-y-2 border-t pt-4">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Payment Orchestration
        </p>
        <NavLink
          href="/profile"
          icon={<User className="h-5 w-5" />}
          label="Profile"
        />
        <NavLink
          href="#"
          icon={<LogOut className="h-5 w-5" />}
          label="Logout"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
}
