import { KpiCard } from "@/components/common/KpiCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SkeletonCard, SkeletonTable } from "@/components/common/SkeletonCard";
import { useDashboardKpis } from "@/hooks/use-dashboard";
import { useTrips } from "@/hooks/use-trips";
import { fuelSpendData, utilizationData } from "@/lib/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripStatus } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const kpisQuery = useDashboardKpis();
  const tripsQuery = useTrips({ per_page: 6 });
  const loading = kpisQuery.isLoading || tripsQuery.isLoading;

  // Map backend KPI data to the shape KpiCard expects
  const kpis = kpisQuery.data
    ? Array.isArray(kpisQuery.data)
      ? kpisQuery.data
      : [
        { label: "Active Fleet", value: (kpisQuery.data as any).availableVehicles ?? 0, icon: "truck" },
        { label: "Maintenance Alerts", value: (kpisQuery.data as any).upcomingMaintenance ?? 0, icon: "wrench" },
        { label: "Active Trips", value: (kpisQuery.data as any).activeTrips ?? 0, icon: "gauge" },
        { label: "Total Drivers", value: (kpisQuery.data as any).totalDrivers ?? 0, icon: "users" },
      ]
    : [];

  const recentTrips = tripsQuery.data?.data ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs border-border"
            onClick={() => toast({ title: "Filters", description: "Advanced filtering coming in a future update." })}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
          </Button>
          <span className="text-xs text-muted-foreground">Showing data for today</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-muted-foreground"
          onClick={() => {
            kpisQuery.refetch();
            tripsQuery.refetch();
            toast({ title: "Data Refreshed", description: "Dashboard metrics have been updated." });
          }}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* KPI Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi: any) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fuel Spend Trend
          </h3>
          {loading ? (
            <div className="h-48 animate-pulse rounded bg-muted" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={fuelSpendData}>
                <defs>
                  <linearGradient id="fuelGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: 8, fontSize: 12 }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Spend"]}
                />
                <Area type="monotone" dataKey="amount" stroke="hsl(172, 66%, 50%)" fill="url(#fuelGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Fleet Utilization
          </h3>
          {loading ? (
            <div className="h-48 animate-pulse rounded bg-muted" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={utilizationData}>
                <defs>
                  <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: 8, fontSize: 12 }}
                  formatter={(value: number) => [`${value}%`, "Utilization"]}
                />
                <Area type="monotone" dataKey="rate" stroke="hsl(38, 92%, 50%)" fill="url(#utilGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Trips
          </h3>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
            View all →
          </Button>
        </div>
        {loading ? (
          <div className="p-5">
            <SkeletonTable rows={4} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Trip Code</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Route</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Driver</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Vehicle</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Distance</th>
                </tr>
              </thead>
              <tbody>
                {recentTrips.map((trip: any) => (
                  <tr key={trip.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-3 font-mono text-xs font-medium text-primary">{trip.tripCode || trip.id}</td>
                    <td className="px-5 py-3 text-xs">
                      <span className="text-foreground">{trip.origin}</span>
                      <span className="mx-1.5 text-muted-foreground">→</span>
                      <span className="text-foreground">{trip.destination}</span>
                    </td>
                    <td className="px-5 py-3 text-xs text-foreground">{trip.driverName || trip.driver?.user?.name || "—"}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{trip.vehicleName || trip.vehicle?.make || "—"}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={trip.status as any} />
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-muted-foreground">
                      {(trip.distanceKm || 0).toLocaleString()} km
                    </td>
                  </tr>
                ))}
                {recentTrips.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-xs text-muted-foreground">
                      No trips found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
