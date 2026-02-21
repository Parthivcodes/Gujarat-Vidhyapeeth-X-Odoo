import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAppStore } from "@/stores/app-store";
import { AppLayout } from "@/components/layout/AppLayout";
import { navItems } from "@/lib/navigation";

const Auth = lazy(() => import("./pages/Auth"));
const Signup = lazy(() => import("./pages/Signup"));
const Index = lazy(() => import("./pages/Index"));
const Vehicles = lazy(() => import("./pages/Vehicles"));
const Trips = lazy(() => import("./pages/Trips"));
const Drivers = lazy(() => import("./pages/Drivers"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const Expenses = lazy(() => import("./pages/Expenses"));
const Analytics = lazy(() => import("./pages/Analytics"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentRole } = useAppStore();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  const currentNavItem = navItems.find((item) => item.href === location.pathname);
  if (currentNavItem && !currentNavItem.roles.includes(currentRole as any)) {
    const defaultRoute = navItems.find((item) => item.roles.includes(currentRole as any))?.href || "/auth";
    return <Navigate to={defaultRoute} replace />;
  }

  return <>{children}</>;
}

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
