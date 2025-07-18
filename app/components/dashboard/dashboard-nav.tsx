"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/app/components/ui/button";
import { Settings, User, Menu, X, LogOut, PlusCircle } from "lucide-react";
import Logo from "@/app/components/ui/logo";
import { useCurrentUser } from "@/app/components/providers/dashboard-provider";

export default function DashboardNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuthActions();
  const user = useCurrentUser();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard">
                <Logo width={24} height={24} />
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/new">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Site
                </Link>
              </Button>

              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {user?.name || user?.email || "User"}
                  </span>
                </div>

                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="w-4 h-4" />
                  </Link>
                </Button>

                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-2 space-y-1">
              {/* User Info */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg mb-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {user?.name || user?.email || "User"}
                </span>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-border mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-2"
                  asChild
                >
                  <Link href="/dashboard/new">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    New Site
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start mb-2"
                  asChild
                >
                  <Link href="/dashboard/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
