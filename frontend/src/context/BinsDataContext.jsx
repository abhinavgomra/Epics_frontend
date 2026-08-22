import { createContext, useContext } from "react";
import { useBinsData } from "../hooks/useBinsData";

const BinsDataContext = createContext(null);

export function BinsDataProvider({ children }) {
  const value = useBinsData();
  return (
    <BinsDataContext.Provider value={value}>{children}</BinsDataContext.Provider>
  );
}

export function useBinsDataContext() {
  const ctx = useContext(BinsDataContext);
  if (!ctx) {
    throw new Error("useBinsDataContext must be used within BinsDataProvider");
  }
  return ctx;
}
