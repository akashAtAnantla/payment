// lib/redux/features/connections-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Country, Gateway, PaymentMethod } from "@/types";

interface ConnectionsState {
  gateways: Gateway[];
  visiblePaymentGateways: Record<
    string,
    { gatewayId: string; isActive: boolean }[]
  >;
  selectedCountry: Country | null;
  selectedMethods: PaymentMethod[];
  isLoading: boolean;
}

const initialState: ConnectionsState = {
  gateways: [
    {
      id: "gateway-1",
      name: "Stripe",
      methods: ["Credit Card", "Debit Card", "Apple Pay", "Google Pay"],
      countries: ["United States", "Canada", "United Kingdom"],
      isActive: true,
      createdAt: new Date().toISOString(),
      config: {
        "API Key": "sk_live_xxx",
        "Webhook URL": "https://example.com/webhook",
        "Webhook Secret": "whsec_abc123",
      },
    },
    {
      id: "gateway-2",
      name: "PayPal",
      methods: ["PayPal", "Credit Card"],
      countries: ["United States", "Germany", "Australia"],
      isActive: true,
      createdAt: new Date().toISOString(),
      config: {
        "Client ID": "paypal_client_123",
        Secret: "paypal_secret_456",
      },
    },
    {
      id: "gateway-3",
      name: "Razorpay",
      methods: ["UPI", "Net Banking", "Credit Card"],
      countries: ["India"],
      isActive: true,
      createdAt: new Date().toISOString(),
      config: {
        "Key ID": "rzp_key_789",
        "Key Secret": "rzp_secret_012",
      },
    },
  ],
  visiblePaymentGateways: {
    "merchant-1": [
      { gatewayId: "gateway-1", isActive: true },
      { gatewayId: "gateway-2", isActive: false },
    ],
    "merchant-2": [
      { gatewayId: "gateway-1", isActive: true },
      { gatewayId: "gateway-2", isActive: true },
      { gatewayId: "gateway-3", isActive: true },
    ],
  },
  selectedCountry: null,
  selectedMethods: [],
  isLoading: false,
};

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    addGateway: (
      state,
      action: PayloadAction<Omit<Gateway, "id" | "createdAt">>
    ) => {
      const newGateway: Gateway = {
        id: `gateway-${state.gateways.length + 1}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.gateways.push(newGateway);
    },
    editGateway: (state, action: PayloadAction<Gateway>) => {
      const index = state.gateways.findIndex((g) => g.id === action.payload.id);
      if (index !== -1) {
        state.gateways[index] = action.payload;
      }
    },
    deleteGateway: (state, action: PayloadAction<string>) => {
      state.gateways = state.gateways.filter((g) => g.id !== action.payload);
      Object.keys(state.visiblePaymentGateways).forEach((merchantId) => {
        state.visiblePaymentGateways[merchantId] =
          state.visiblePaymentGateways[merchantId]?.filter(
            (mg) => mg.gatewayId !== action.payload
          ) || [];
      });
    },
    setGatewayVisibility: (
      state,
      action: PayloadAction<{
        merchantId: string;
        gatewayId: string;
        visible: boolean;
      }>
    ) => {
      const { merchantId, gatewayId, visible } = action.payload;
      if (!state.visiblePaymentGateways[merchantId]) {
        state.visiblePaymentGateways[merchantId] = [];
      }
      const merchantGateways = state.visiblePaymentGateways[merchantId];
      const existing = merchantGateways.find(
        (mg) => mg.gatewayId === gatewayId
      );
      if (visible && !existing) {
        merchantGateways.push({ gatewayId, isActive: false });
      } else if (!visible && existing) {
        state.visiblePaymentGateways[merchantId] = merchantGateways.filter(
          (mg) => mg.gatewayId !== gatewayId
        );
      }
    },
    toggleMerchantGatewayActive: (
      state,
      action: PayloadAction<{
        merchantId: string;
        gatewayId: string;
        forceInactive?: boolean;
      }>
    ) => {
      const { merchantId, gatewayId, forceInactive } = action.payload;
      if (!state.visiblePaymentGateways[merchantId]) {
        state.visiblePaymentGateways[merchantId] = [];
      }
      const merchantGateways = state.visiblePaymentGateways[merchantId];
      const existing = merchantGateways.find(
        (mg) => mg.gatewayId === gatewayId
      );
      if (existing) {
        existing.isActive = forceInactive ? false : !existing.isActive;
      }
    },
    setSelectedCountry: (state, action: PayloadAction<Country | null>) => {
      state.selectedCountry = action.payload;
    },
    setSelectedMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.selectedMethods = action.payload;
    },
  },
});

export const {
  addGateway,
  editGateway,
  deleteGateway,
  setGatewayVisibility,
  toggleMerchantGatewayActive,
  setSelectedCountry,
  setSelectedMethods,
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
