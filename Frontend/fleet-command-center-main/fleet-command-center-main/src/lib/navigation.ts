import type { NavItem } from "./types";

export const navItems: NavItem[] = [
  { label: "Command Center", href: "/", icon: "layout-dashboard", roles: ["fleet_manager"] },
  { label: "Vehicles", href: "/vehicles", icon: "truck", roles: ["fleet_manager", "dispatcher"] },
  { label: "Trip Dispatch", href: "/trips", icon: "route", roles: ["fleet_manager", "dispatcher"], badge: "4" },
  { label: "Drivers", href: "/drivers", icon: "users", roles: ["fleet_manager", "dispatcher", "safety_officer"] },
  { label: "Maintenance", href: "/maintenance", icon: "wrench", roles: ["fleet_manager", "safety_officer"] },
  { label: "Expenses", href: "/expenses", icon: "receipt", roles: ["fleet_manager", "financial_analyst"] },
  { label: "Analytics", href: "/analytics", icon: "bar-chart-3", roles: ["fleet_manager", "financial_analyst"] },
];
