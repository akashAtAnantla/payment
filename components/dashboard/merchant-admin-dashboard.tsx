// components/dashboard/merchant-admin-dashboard.tsx
"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  LineChart,
  Line,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function MerchantAdminDashboard({
  merchantId,
}: {
  merchantId: string;
}) {
  const { user, currentMerchantContext } = useAppSelector(
    (state) => state.auth
  );
  const { merchants, visiblePaymentGateways } = useAppSelector(
    (state) => state.merchants
  );
  const { gateways } = useAppSelector((state) => state.connections);

  const merchant = merchants.find((m) => m.id === merchantId);
  if (!merchant) return null;

  // Real data: Active gateways
  const enabledProviders = useMemo(() => {
    return (visiblePaymentGateways[merchantId] || [])
      .filter((pg) => pg.isActive)
      .map((pg) => {
        const gateway = gateways.find((g) => g.id === pg.gatewayId);
        return {
          name: gateway?.name || pg.gatewayId,
          count: 1,
        };
      });
  }, [visiblePaymentGateways, gateways, merchantId]);

  // Dummy transaction data (replace with real GatewayData.transactions)
  const transactionCounts = useMemo(() => {
    // Mock daily transactions (5 days)
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    return days.map((day) => ({
      day,
      transactions: Math.floor(Math.random() * 100) + 100, // Replace with real data
    }));
  }, []);

  // Dummy volume data (replace with real GatewayData.volume)
  const transactionVolume = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    return days.map((day) => ({
      day,
      volume: Math.floor(Math.random() * 2000) + 5000, // Replace with real data
    }));
  }, []);

  // DashboardData metrics (replace with real data)
  const dashboardData = {
    totalTransactions: 1234,
    totalVolume: 56789,
    avgSuccessRate: 95.5,
    monthlyGrowth: 12.3,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {user?.role === "superAdmin" && currentMerchantContext
          ? `Merchant Dashboard: ${merchant.name}`
          : "Merchant Dashboard"}
      </h1>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {dashboardData.totalTransactions}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${dashboardData.totalVolume}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {dashboardData.avgSuccessRate}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dashboardData.monthlyGrowth}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Transaction Count</CardTitle>
            <CardDescription>Transactions over the last 5 days</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart width={300} height={200} data={transactionCounts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="transactions" fill="#0088FE" />
            </BarChart>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Enabled Payment Gateways</CardTitle>
            <CardDescription>Active gateways for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart width={300} height={200}>
              <Pie
                data={enabledProviders}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884D8"
                dataKey="count"
                label
              >
                {enabledProviders.map((entry, index) => (
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
        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
            <CardDescription>Volume over the last 5 days</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart width={300} height={200} data={transactionVolume}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="volume" stroke="#00C49F" />
            </LineChart>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Merchant ID: {merchantId}</p>
          <p>Merchant Name: {merchant.name}</p>
          <p>Role: {user?.role}</p>
          {user?.role === "superAdmin" && (
            <p>Impersonating Merchant: {currentMerchantContext}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
