"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface DashboardContextType {
  user: Doc<"users"> | null | undefined;
  businesses: Doc<"businesses">[] | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  authChecked: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.auth.currentUser);
  const businesses = useQuery(
    api.businesses.listByUser,
    user ? { userId: user._id } : "skip",
  );

  // Track whether we've completed the initial auth check
  const [authChecked, setAuthChecked] = useState(false);

  // Determine loading state
  const isLoading =
    user === undefined || (user !== null && businesses === undefined);
  const isAuthenticated = user !== null && user !== undefined;

  // Mark auth as checked once we have a definitive answer
  useEffect(() => {
    if (user !== undefined) {
      setAuthChecked(true);
    }
  }, [user]);

  return (
    <DashboardContext.Provider
      value={{
        user,
        businesses,
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

// Helper hook for auth state
export function useAuthState() {
  const { isAuthenticated, isLoading, authChecked } = useDashboardData();
  return { isAuthenticated, isLoading, authChecked };
}
