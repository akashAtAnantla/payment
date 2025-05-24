// components/merchants/merchants-client.tsx
"use client";

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setMerchantContext } from "@/lib/redux/features/auth-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useLoading } from "@/components/loading-provider";

export default function MerchantsClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { setLoading } = useLoading();
  const { merchants } = useAppSelector((state) => state.merchants);

  const handleViewDashboard = async (merchantId: string) => {
    setLoading(true);
    try {
      dispatch(setMerchantContext(merchantId));
      router.push(`/dashboard/${merchantId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Merchants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {merchants.map((merchant) => (
              <div
                key={merchant.id}
                className="flex items-center justify-between p-4 border rounded"
              >
                <div>
                  <h3 className="font-medium">{merchant.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {merchant.id}
                  </p>
                </div>
                <Button
                  onClick={() => handleViewDashboard(merchant.id)}
                  variant="outline"
                >
                  View Dashboard
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
