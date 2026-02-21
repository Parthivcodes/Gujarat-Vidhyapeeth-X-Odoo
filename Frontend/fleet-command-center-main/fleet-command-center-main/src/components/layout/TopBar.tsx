import { useAppStore } from "@/stores/app-store";
import { useLocation } from "react-router-dom";
import { Bell, Search, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { UserRole } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const pageTitles: Record<string, string> = {
  "/": "Command Center",
  "/vehicles": "Vehicle Registry",
  "/trips": "Trip Dispatch",
  "/drivers": "Drivers & Safety",
  "/maintenance": "Maintenance Logs",
  "/expenses": "Expenses & Fuel",
  "/analytics": "Analytics",
};

const roleLabels: Record<UserRole, string> = {
  fleet_manager: "Fleet Manager",
  dispatcher: "Dispatcher",
  safety_officer: "Safety Officer",
  financial_analyst: "Financial Analyst",
};

export function TopBar() {
  const { toast } = useToast();
  const { currentUser, currentRole, setRole, logout } = useAppStore();
  const location = useLocation();
  const title = pageTitles[location.pathname] || "FleetFlow";

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card/50 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        <span className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Global Search - Removed per user request */}

        {/* User Role Badge */}
        <div className="flex h-8 items-center rounded-md border border-primary/20 bg-primary/10 px-3 text-xs font-medium text-primary capitalize">
          {roleLabels[currentRole as UserRole] || currentRole?.replace('_', ' ') || "User"}
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          onClick={() => toast({ title: "Notifications", description: "You have no new alerts." })}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-secondary">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <span className="hidden text-xs font-medium text-foreground sm:inline">
                {currentUser?.name || "User"}
              </span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {currentUser?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs" onClick={logout}>
              <LogOut className="mr-2 h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
