import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { navItems } from "@/lib/navigation";
import {
  LayoutDashboard, Truck, Route, Users, Wrench, Receipt, BarChart3,
  ChevronLeft, ChevronRight, Zap,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "layout-dashboard": LayoutDashboard,
  truck: Truck,
  route: Route,
  users: Users,
  wrench: Wrench,
  receipt: Receipt,
  "bar-chart-3": BarChart3,
};

export function AppSidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar, currentRole } = useAppStore();

  const filteredItems = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary glow-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!sidebarCollapsed && (
            <span className="text-sm font-bold tracking-tight text-foreground">
              FleetFlow
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {filteredItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                )}
              />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/15 px-1.5 text-[10px] font-semibold text-primary">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex h-10 items-center justify-center border-t border-sidebar-border text-sidebar-foreground transition-colors hover:text-foreground"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}
