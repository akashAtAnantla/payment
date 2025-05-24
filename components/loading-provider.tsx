// components/loading-provider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Image from "next/image";

interface LoadingContextType {
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      setRequestCount((prev) => prev + 1);
      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        setRequestCount((prev) => prev - 1);
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    setLoading(requestCount > 0);
  }, [requestCount]);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <LoadingContext.Provider value={{ setLoading }}>
      {loading && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          style={{ display: loading ? "flex" : "none" }}
        >
          <Image
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzYwN2Q2ZjVhN2I5ZGZiNGZiZmZiNGZiZmZiNGZiZmZiNGZiZmZiN&ep=v1_gifs_search&ct=g/3o6Zta2kWPeO2eU9iM/giphy.gif"
            alt="Loading money animation"
            width={100}
            height={100}
            priority
          />
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    // Fallback to prevent runtime error
    console.warn("useLoading called outside LoadingProvider; using fallback.");
    return { setLoading: () => {} };
  }
  return context;
}
