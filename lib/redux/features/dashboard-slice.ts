import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardData } from '@/types';

interface DashboardState {
  superAdminData: DashboardData;
  merchantData: Record<string, DashboardData>;
  isLoading: boolean;
  error: string | null;
}

const createDummyTransactionData = () => {
  const dates = [
    '2023-06-01', '2023-06-02', '2023-06-03', '2023-06-04', '2023-06-05',
    '2023-06-06', '2023-06-07', '2023-06-08', '2023-06-09', '2023-06-10',
    '2023-06-11', '2023-06-12', '2023-06-13', '2023-06-14', '2023-06-15',
    '2023-06-16', '2023-06-17', '2023-06-18', '2023-06-19', '2023-06-20',
    '2023-06-21', '2023-06-22', '2023-06-23', '2023-06-24', '2023-06-25',
    '2023-06-26', '2023-06-27', '2023-06-28', '2023-06-29', '2023-06-30'
  ];
  
  return dates.map(date => ({
    date,
    volume: Math.floor(Math.random() * 50000) + 10000,
    successRate: 90 + Math.random() * 9
  }));
};

const createDummyCountryData = () => {
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 
    'France', 'Australia', 'Japan', 'Brazil', 'Mexico', 'India'
  ] as const;
  
  return countries.map(country => ({
    country,
    volume: Math.floor(Math.random() * 200000) + 50000,
    successRate: 90 + Math.random() * 9
  }));
};

const createDummyGatewayData = () => {
  const gateways = [
    'Stripe', 'PayPal', 'Adyen', 'Klarna', 
    'Square', 'Razorpay', 'Mercado Pago', 'Checkout.com'
  ];
  
  return gateways.map(gateway => ({
    gateway,
    volume: Math.floor(Math.random() * 150000) + 25000,
    successRate: 90 + Math.random() * 9
  }));
};

const createDashboardData = (): DashboardData => {
  const transactions = createDummyTransactionData();
  const totalVolume = transactions.reduce((sum, t) => sum + t.volume, 0);
  const avgSuccessRate = transactions.reduce((sum, t) => sum + t.successRate, 0) / transactions.length;
  
  return {
    transactions,
    countries: createDummyCountryData(),
    gateways: createDummyGatewayData(),
    totalTransactions: transactions.length,
    totalVolume,
    avgSuccessRate,
    monthlyGrowth: Math.random() * 10 + 2
  };
};

const initialState: DashboardState = {
  superAdminData: createDashboardData(),
  merchantData: {
    'merchant-1': createDashboardData(),
    'merchant-2': createDashboardData(),
    'merchant-3': createDashboardData(),
    'merchant-4': createDashboardData(),
    'merchant-5': createDashboardData(),
  },
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;