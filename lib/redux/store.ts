// lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice";
import merchantsReducer from "./features/merchants-slice";
import connectionsReducer from "./features/connections-slice";
import paymentGatewaysReducer from "./features/payment-gateways-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    merchants: merchantsReducer,
    connections: connectionsReducer,
    paymentGateways: paymentGatewaysReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
