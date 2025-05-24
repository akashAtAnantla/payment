import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Route } from '@/types';

interface RoutesState {
  routes: Route[];
  isLoading: boolean;
  error: string | null;
}

const initialRoutes: Route[] = [
  {
    id: 'route-1',
    name: 'US Credit Processing',
    description: 'Primary route for US credit card transactions',
    method: 'Credit Card',
    country: 'United States',
    successRate: 98.5,
    priority: 1,
    isActive: true,
  },
  {
    id: 'route-2',
    name: 'EU Debit Processing',
    description: 'Primary route for European debit transactions',
    method: 'Debit Card',
    country: 'Germany',
    successRate: 99.1,
    priority: 1,
    isActive: true,
  },
  {
    id: 'route-3',
    name: 'UK Alternative Payment',
    description: 'PayPal integration for UK customers',
    method: 'PayPal',
    country: 'United Kingdom',
    successRate: 97.8,
    priority: 2,
    isActive: true,
  },
  {
    id: 'route-4',
    name: 'Global Crypto Payments',
    description: 'Cryptocurrency acceptance route',
    method: 'Cryptocurrency',
    country: 'United States',
    successRate: 95.2,
    priority: 3,
    isActive: false,
  },
  {
    id: 'route-5',
    name: 'APAC Mobile Wallet',
    description: 'Mobile wallet processing for Asia-Pacific',
    method: 'Google Pay',
    country: 'Japan',
    successRate: 98.7,
    priority: 2,
    isActive: true,
  },
  {
    id: 'route-6',
    name: 'LATAM Alternative Payment',
    description: 'Bank transfer support for Latin America',
    method: 'Bank Transfer',
    country: 'Brazil',
    successRate: 94.3,
    priority: 2,
    isActive: true,
  },
  {
    id: 'route-7',
    name: 'US Apple Pay Processing',
    description: 'Mobile payment processing for iOS users',
    method: 'Apple Pay',
    country: 'United States',
    successRate: 99.3,
    priority: 2,
    isActive: true,
  },
  {
    id: 'route-8',
    name: 'EU Installment Payments',
    description: 'Buy now pay later option for European customers',
    method: 'Buy Now Pay Later',
    country: 'France',
    successRate: 96.8,
    priority: 3,
    isActive: true,
  },
];

const initialState: RoutesState = {
  routes: initialRoutes,
  isLoading: false,
  error: null,
};

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    toggleRouteActive: (state, action: PayloadAction<string>) => {
      const route = state.routes.find(r => r.id === action.payload);
      if (route) {
        route.isActive = !route.isActive;
      }
    },
  },
});

export const { setLoading, setError, toggleRouteActive } = routesSlice.actions;
export default routesSlice.reducer;