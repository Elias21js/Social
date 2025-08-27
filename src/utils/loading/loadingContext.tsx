"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { CursorLoader } from "./cursorLoader";

type LoadingContextType = {
  loading: boolean;
  setLoading: (value: boolean) => void;
  cursorLoading: boolean;
  setCursorLoading: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [cursorLoading, setCursorLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading, cursorLoading, setCursorLoading }}>
      {children}

      {/* Loader central */}
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      {/* Loader no cursor */}
      {cursorLoading && <CursorLoader />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within LoadingProvider");
  return context;
}
