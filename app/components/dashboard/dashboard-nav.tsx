"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/app/components/ui/button";
import {
  Settings,
  User,
  Menu,
  X,
  LogOut,
  CreditCard,
  LayoutGrid,
} from "lucide-react";
import Logo from "@/app/components/ui/logo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { cn } from "@/app/lib/utils";

export default function DashboardNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuthActions();
  const userWithSub = useQuery(api.auth.currentUserWithSubscription);
  const user = userWithSub?.user;

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true;
    }
    return false;
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
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant={isActive("/dashboard") ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(isActive("/dashboard") && "bg-muted")}
                >
                  <Link href="/dashboard">
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    My Sites
                  </Link>
                </Button>

                <Button
                  variant={
                    isActive("/dashboard/billing") ? "secondary" : "ghost"
                  }
                  size="sm"
                  asChild
                  className={cn(isActive("/dashboard/billing") && "bg-muted")}
                >
                  <Link href="/dashboard/billing">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </Link>
                </Button>

                <Button
                  variant={
                    isActive("/dashboard/settings") ? "secondary" : "ghost"
                  }
                  size="sm"
                  asChild
                  className={cn(isActive("/dashboard/settings") && "bg-muted")}
                >
                  <Link href="/dashboard/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  variant={isActive("/dashboard") ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start mb-2",
                    isActive("/dashboard") && "bg-muted",
                  )}
                  asChild
                >
                  <Link href="/dashboard">
                    <LayoutGrid className="w-4 h-4 mr-2" />
                    My Sites
                  </Link>
                </Button>

                <Button
                  variant={
                    isActive("/dashboard/billing") ? "secondary" : "ghost"
                  }
                  size="sm"
                  className={cn(
                    "w-full justify-start mb-2",
                    isActive("/dashboard/billing") && "bg-muted",
                  )}
                  asChild
                >
                  <Link href="/dashboard/billing">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Billing
                  </Link>
                </Button>

                <Button
                  variant={
                    isActive("/dashboard/settings") ? "secondary" : "ghost"
                  }
                  size="sm"
                  className={cn(
                    "w-full justify-start mb-2",
                    isActive("/dashboard/settings") && "bg-muted",
                  )}
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
                  Log out
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
