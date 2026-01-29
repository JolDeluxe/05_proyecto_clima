"use client";
import { createContext, useContext, useState } from "react";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [showBackground, setShowBackground] = useState(true);

  return (
    <DashboardContext.Provider value={{ showBackground, setShowBackground }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }
  return ctx;
}
