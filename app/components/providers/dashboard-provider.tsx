"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

interface DashboardContextType {
  user: Doc<"users"> | null | undefined;
  businesses: Doc<"businesses">[] | undefined;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.auth.currentUser);
  const businesses = useQuery(
    api.businesses.listByUser, 
    user ? { userId: user._id } : "skip"
  );
  
  const isLoading = user === undefined || (user !== null && businesses === undefined);

  return (
    <DashboardContext.Provider value={{ user, businesses, isLoading }}>
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

