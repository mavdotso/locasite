"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface DashboardContextType {
  user: Doc<"users"> | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  authChecked: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  // Use combined query that fetches user and subscription data together
  const userWithSubscription = useQuery(api.auth.currentUserWithSubscription);

  // Track whether we've completed the initial auth check
  const [authChecked, setAuthChecked] = useState(false);

  // Determine loading state
  const isLoading = userWithSubscription === undefined;
  const isAuthenticated = userWithSubscription !== null && userWithSubscription?.user !== null;
  const user = userWithSubscription?.user || null;

  // Mark auth as checked once we have a definitive answer
  useEffect(() => {
    if (userWithSubscription !== undefined) {
      setAuthChecked(true);
    }
  }, [userWithSubscription]);

  return (
    <DashboardContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        authChecked,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboardData must be used within a DashboardProvider");
  }
  return context;
}

// Helper hook for components that only need the current user
export function useCurrentUser() {
  const { user } = useDashboardData();
  return user;
}
