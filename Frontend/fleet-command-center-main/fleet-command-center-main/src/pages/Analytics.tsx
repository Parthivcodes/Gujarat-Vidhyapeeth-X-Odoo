import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Calendar } from "lucide-react";
import { useFleetPerformance, useFinancialReport, useDriverRankings, useChartData } from "@/hooks/use-analytics";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// Fallback static data (used if API returns empty/null)
const fallbackFuelEfficiency = [
  { month: "Sep", kpl: 3.2 }, { month: "Oct", kpl: 3.4 }, { month: "Nov", kpl: 3.1 },
  { month: "Dec", kpl: 3.3 }, { month: "Jan", kpl: 3.6 }, { month: "Feb", kpl: 3.5 },
];
const fallbackVehicleROI = [
  { vehicle: "Titan", roi: 142 }, { vehicle: "Swift", roi: 128 },
  { vehicle: "Cargo", roi: 115 }, { vehicle: "Blue", roi: 98 },
  { vehicle: "Road", roi: 135 }, { vehicle: "Silver", roi: 110 },
  { vehicle: "Hawk", roi: 88 },
];
const fallbackCostPerKm = [
  { month: "Sep", cost: 1.85 }, { month: "Oct", cost: 1.92 }, { month: "Nov", cost: 1.78 },
  { month: "Dec", cost: 1.82 }, { month: "Jan", cost: 1.95 }, { month: "Feb", cost: 1.88 },
];
const fallbackUtilization = [
  { month: "Sep", rate: 72 }, { month: "Oct", rate: 75 }, { month: "Nov", rate: 68 },
  { month: "Dec", rate: 71 }, { month: "Jan", rate: 80 }, { month: "Feb", rate: 78 },
];

const chartTooltip = {
  contentStyle: { background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: 8, fontSize: 12 },
};

export default function Analytics() {
  const charts = useChartData(6);

  // Use API data if available, otherwise fallback
  const fuelEfficiency = charts.data?.fuelEfficiency || fallbackFuelEfficiency;
  const vehicleROI = charts.data?.vehicleROI || fallbackVehicleROI;
  const costPerKm = charts.data?.costPerKm || fallbackCostPerKm;
  const utilizationTrend = charts.data?.utilizationTrend || fallbackUtilization;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input type="date" defaultValue="2025-09-01" className="h-8 pl-9 text-xs w-36" />
          </div>
          <span className="text-xs text-muted-foreground">to</span>
          <Input type="date" defaultValue="2026-02-21" className="h-8 text-xs w-36" />
        </div>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" /> Export Report
        </Button>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Fuel Efficiency */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fuel Efficiency Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={fuelEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v} km/l`} />
              <Tooltip {...chartTooltip} formatter={(v: number) => [`${v} km/l`, "Efficiency"]} />
              <Line type="monotone" dataKey="kpl" stroke="hsl(172, 66%, 50%)" strokeWidth={2} dot={{ fill: "hsl(172, 66%, 50%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle ROI */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vehicle ROI Index</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={vehicleROI}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
              <XAxis dataKey="vehicle" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTooltip} formatter={(v: number) => [`${v}%`, "ROI"]} />
              <Bar dataKey="roi" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Utilization */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Utilization Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={utilizationTrend}>
              <defs>
                <linearGradient id="utilGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(262, 60%, 55%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(262, 60%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip {...chartTooltip} formatter={(v: number) => [`${v}%`, "Utilization"]} />
              <Area type="monotone" dataKey="rate" stroke="hsl(262, 60%, 55%)" fill="url(#utilGrad2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost per km */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost per KM</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={costPerKm}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip {...chartTooltip} formatter={(v: number) => [`$${v}`, "Cost/km"]} />
              <Line type="monotone" dataKey="cost" stroke="hsl(152, 69%, 40%)" strokeWidth={2} dot={{ fill: "hsl(152, 69%, 40%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
