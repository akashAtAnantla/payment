// components/ui/breadcrumbs-dynamic.tsx
"use client";

import { usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import Link from "next/link";
import { getMerchants } from "@/lib/redux/features/merchants-slice";
import { useEffect } from "react";

export default function BreadcrumbsDynamic() {
  const pathname = usePathname();
  const { user, currentMerchantContext } = useAppSelector(
    (state) => state.auth
  );
  const merchants = getMerchants();
  const isSuperAdmin = user?.role === "superAdmin";
  const isImpersonationMode = isSuperAdmin && !!currentMerchantContext;
  const merchantId = isImpersonationMode
    ? currentMerchantContext
    : user?.merchantId;
  const merchantName =
    merchants.find((m) => m.id === merchantId)?.name || "Unknown";

  useEffect(() => {
    console.log("BreadcrumbsDynamic rendered for:", pathname);
  }, [pathname]);

  const crumbs = [];

  if (isSuperAdmin && !isImpersonationMode) {
    crumbs.push({ label: "Home", href: "/dashboard" });
    if (pathname.includes("/merchants")) {
      crumbs.push({ label: "Merchants", href: "/merchants" });
    } else if (pathname.includes("/connections")) {
      crumbs.push({ label: "Payment Gateway", href: "/dashboard/connections" });
    }
  } else if (isImpersonationMode && merchantId) {
    crumbs.push({ label: "Home", href: "/dashboard" });
    crumbs.push({ label: "Merchants", href: "/merchants" });
    crumbs.push({ label: merchantName, href: `/dashboard/${merchantId}` });
    if (pathname.includes("/connections")) {
      crumbs.push({
        label: "Connections",
        href: `/dashboard/${merchantId}/connections`,
      });
    }
  } else if (user?.role === "merchantAdmin" && user?.merchantId) {
    crumbs.push({ label: "Home", href: `/dashboard/${user.merchantId}` });
    if (pathname.includes("/connections")) {
      crumbs.push({
        label: "Connections",
        href: `/dashboard/${user.merchantId}/connections`,
      });
    }
  }

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex space-x-2">
        {crumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index < crumbs.length - 1 ? (
              <>
                <Link
                  href={crumb.href}
                  className="text-blue-600 hover:underline"
                >
                  {crumb.label}
                </Link>
                <span className="mx-2">{">"}</span>
              </>
            ) : (
              <span className="text-gray-500">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
