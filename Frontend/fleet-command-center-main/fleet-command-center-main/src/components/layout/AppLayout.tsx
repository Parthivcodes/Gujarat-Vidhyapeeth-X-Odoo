import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

export function AppLayout() {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-60"
        )}
      >
        <TopBar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
