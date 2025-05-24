// components/dashboard/super-admin-dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { setMerchantContext } from "@/lib/redux/features/auth-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function SuperAdminDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const { merchants } = useAppSelector((state) => state.merchants);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);

  // Mock merchants if empty
  const effectiveMerchants =
    merchants.length > 0
      ? merchants
      : [
          { id: "mock-1", name: "Mock Merchant 1" },
          { id: "mock-2", name: "Mock Merchant 2" },
        ];

  // Transaction counts
  const dummyTransactionCounts = effectiveMerchants.map((merchant) => ({
    name: merchant.name,
    transactions: Math.floor(Math.random() * 1000) + 100,
  }));

  // Transaction types (static)
  const dummyTransactionTypes = [
    { name: "Credit Card", value: 400 },
    { name: "PayPal", value: 300 },
    { name: "Bank Transfer", value: 200 },
    { name: "UPI", value: 100 },
  ];

  const filteredTransactionCounts = selectedMerchant
    ? dummyTransactionCounts.filter(
        (data) =>
          data.name ===
          effectiveMerchants.find((m) => m.id === selectedMerchant)?.name
      )
    : dummyTransactionCounts;

  const handleViewMerchantDashboard = (merchantId: string) => {
    dispatch(setMerchantContext(merchantId));
    router.push(`/dashboard/${merchantId}`);
    toast({
      title: "Viewing Merchant Dashboard",
      description: `Now viewing dashboard for merchant ID: ${merchantId}`,
    });
  };

  // Redirect if not Super Admin
  useEffect(() => {
    if (!user || user.role !== "superAdmin") {
      toast({
        title: "Access Denied",
        description: "Only Super Admins can access this dashboard.",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [user, router, toast]);

  if (!user || user.role !== "superAdmin") {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>

      {effectiveMerchants.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            No merchants available. Please add merchants to view data.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Merchants</h2>
            <Select
              value={selectedMerchant || "all"}
              onValueChange={(value) =>
                setSelectedMerchant(value === "all" ? null : value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select merchant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Merchants</SelectItem>
                {effectiveMerchants.map((merchant) => (
                  <SelectItem key={merchant.id} value={merchant.id}>
                    {merchant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Counts by Merchant</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredTransactionCounts.length === 0 ? (
                  <p className="text-muted-foreground">No data available.</p>
                ) : (
                  <BarChart
                    width={300}
                    height={200}
                    data={filteredTransactionCounts}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="transactions" fill="#0088FE" />
                  </BarChart>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Transaction Types</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart width={300} height={200}>
                  <Pie
                    data={dummyTransactionTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884D8"
                    dataKey="value"
                    label
                  >
                    {dummyTransactionTypes.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Merchant List</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {effectiveMerchants.map((merchant) => (
                  <li
                    key={merchant.id}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {merchant.name} (ID: {merchant.id})
                    </span>
                    <button
                      onClick={() => handleViewMerchantDashboard(merchant.id)}
                      className="text-blue-600 hover:underline"
                    >
                      View Dashboard
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
