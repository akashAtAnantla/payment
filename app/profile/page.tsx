// app/profile/page.tsx
"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BreadcrumbsDynamic from "@/components/ui/breadcrumbs-dynamic";

export default function ProfilePage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <BreadcrumbsDynamic />
      <h1 className="text-3xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Name: {user?.name || "Unknown"}</p>
          <p>Email: {user?.email || "Unknown"}</p>
          <p>Role: {user?.role || "Unknown"}</p>
          {user?.merchantId && <p>Merchant ID: {user.merchantId}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
