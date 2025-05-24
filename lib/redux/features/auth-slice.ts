// lib/redux/features/auth-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  role: "superAdmin" | "merchantAdmin";
  merchantId?: string;
}

interface AuthState {
  user: User | null;
  currentMerchantContext: string | null;
}

const initialState: AuthState = {
  user: null,
  currentMerchantContext: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setMerchantContext: (state, action: PayloadAction<string>) => {
      state.currentMerchantContext = action.payload;
    },
    clearMerchantContext: (state) => {
      state.currentMerchantContext = null;
    },
    logout: (state) => {
      state.user = null;
      state.currentMerchantContext = null;
    },
  },
});

export const { setUser, setMerchantContext, clearMerchantContext, logout } =
  authSlice.actions;
export default authSlice.reducer;
