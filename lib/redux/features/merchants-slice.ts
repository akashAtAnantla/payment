// lib/redux/features/merchants-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Merchant } from "@/types";

interface MerchantsState {
  merchants: Merchant[];
  visiblePaymentGateways: Record<
    string,
    { gatewayId: string; isActive: boolean }[]
  >;
  isLoading: boolean;
  error?: string;
}

const initialState: MerchantsState = {
  merchants: [
    {
      id: "merchant-1",
      name: "Tech Solutions",
      status: "active",
      createdAt: new Date().toISOString(),
    },
    {
      id: "merchant-2",
      name: "Global Enterprises",
      status: "active",
      createdAt: new Date().toISOString(),
    },
  ],
  visiblePaymentGateways: {
    "merchant-1": [
      { gatewayId: "stripe", isActive: true },
      { gatewayId: "paypal", isActive: false },
    ],
    "merchant-2": [
      { gatewayId: "stripe", isActive: true },
      { gatewayId: "paypal", isActive: true },
      { gatewayId: "razorpay", isActive: true },
    ],
  },
  isLoading: false,
  error: undefined,
};

const merchantsSlice = createSlice({
  name: "merchants",
  initialState,
  reducers: {
    addMerchant: (
      state,
      action: PayloadAction<Omit<Merchant, "id" | "createdAt">>
    ) => {
      const newMerchant: Merchant = {
        id: `merchant-${state.merchants.length + 1}`,
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.merchants.push(newMerchant);
    },
    updateMerchant: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Merchant> }>
    ) => {
      const index = state.merchants.findIndex(
        (m) => m.id === action.payload.id
      );
      if (index !== -1) {
        state.merchants[index] = {
          ...state.merchants[index],
          ...action.payload.data,
        };
      }
    },
    deleteMerchant: (state, action: PayloadAction<string>) => {
      state.merchants = state.merchants.filter((m) => m.id !== action.payload);
    },
  },
});

export const { addMerchant, updateMerchant, deleteMerchant } =
  merchantsSlice.actions;
export const getMerchants = () => initialState.merchants;
export default merchantsSlice.reducer;
