// lib/redux/features/payment-gateways-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentGateway } from "@/types";

interface PaymentGatewaysState {
  paymentGateways: PaymentGateway[];
}

const initialState: PaymentGatewaysState = {
  paymentGateways: [
    {
      id: "gateway-1",
      name: "Stripe",
      active: true,
      visible: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "gateway-2",
      name: "PayPal",
      active: true,
      visible: true,
      createdAt: new Date().toISOString(),
    },
  ],
};

const paymentGatewaysSlice = createSlice({
  name: "paymentGateways",
  initialState,
  reducers: {
    updatePaymentGateway: (
      state,
      action: PayloadAction<{ id: string; data: Partial<PaymentGateway> }>
    ) => {
      const { id, data } = action.payload;
      const index = state.paymentGateways.findIndex(
        (gateway) => gateway.id === id
      );
      if (index !== -1) {
        state.paymentGateways[index] = {
          ...state.paymentGateways[index],
          ...data,
        };
      }
    },
  },
});

export const { updatePaymentGateway } = paymentGatewaysSlice.actions;
export default paymentGatewaysSlice.reducer;
