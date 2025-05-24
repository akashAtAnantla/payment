// components/providers.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Provider store={store}>
        <Toaster richColors position="top-right" />
        {children}
      </Provider>
    </ThemeProvider>
  );
}
