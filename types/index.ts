// types/index.ts
export type Role = "superAdmin" | "merchantAdmin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  merchantId?: string;
  password: string;
}

export interface Merchant {
  id: string;
  name: string;
  status: "active" | "inactive";
  createdAt: string;
}

export type Country =
  | "United States"
  | "Canada"
  | "United Kingdom"
  | "Germany"
  | "France"
  | "Australia"
  | "Japan"
  | "Brazil"
  | "Mexico"
  | "India";

export type PaymentMethod =
  | "Credit Card"
  | "Debit Card"
  | "PayPal"
  | "Apple Pay"
  | "Google Pay"
  | "Bank Transfer"
  | "Cryptocurrency"
  | "Buy Now Pay Later"
  | "UPI"
  | "Net Banking"
  | "Wallet";

export interface Gateway {
  id: string;
  name: string;
  methods: PaymentMethod[];
  countries: Country[];
  isActive: boolean;
  createdAt: string;
  config?: Record<string, string>;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  method: PaymentMethod;
  country: Country;
  successRate: number;
  priority: number;
  isActive: boolean;
}

export interface TransactionData {
  date: string;
  volume: number;
  successRate: number;
}

export interface CountryData {
  country: Country;
  volume: number;
  successRate: number;
}

export interface GatewayData {
  gateway: string;
  volume: number;
  successRate: number;
}

export interface DashboardData {
  transactions: TransactionData[];
  countries: CountryData[];
  gateways: GatewayData[];
  totalTransactions: number;
  totalVolume: number;
  avgSuccessRate: number;
  monthlyGrowth: number;
}

export interface PaymentGateway {
  id: string;
  name: string;
  active: boolean;
  visible: boolean;
  createdAt: string;
}

export type GatewayConfigStep = {
  label: string;
  placeholder: string;
  type: "text" | "url" | "password";
};
