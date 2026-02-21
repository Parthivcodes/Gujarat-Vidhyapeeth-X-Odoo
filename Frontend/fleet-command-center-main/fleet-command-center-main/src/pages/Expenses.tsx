import { useState } from "react";
import { useExpenses } from "@/hooks/use-expenses";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SkeletonTable } from "@/components/common/SkeletonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { fuelSpendData, costBreakdownData } from "@/lib/mock-data";

const categoryColors: Record<string, string> = {
  fuel: "active",
  maintenance: "warning",
  insurance: "dispatched",
  toll: "completed",
  tolls: "completed",
  parking: "inactive",
  other: "inactive",
};

export default function Expenses() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [page, setPage] = useState(1);

  const expensesQuery = useExpenses({
    search: search || undefined,
    category: catFilter !== "all" ? catFilter : undefined,
    per_page: 15,
    page,
  });

  const expenses = expensesQuery.data?.data ?? [];
  const meta = expensesQuery.data?.meta;
  const totalPages = meta?.lastPage ?? 1;
  const loading = expensesQuery.isLoading;

  const totalExpenses = expenses.reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
  const fuelTotal = expenses.filter((e: any) => e.category === "fuel").reduce((s: number, e: any) => s + Number(e.amount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Expenses</span>
          <div className="mt-2 font-mono text-2xl font-bold text-foreground">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Fuel Costs</span>
          <div className="mt-2 font-mono text-2xl font-bold text-primary">${fuelTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Records</span>
          <div className="mt-2 font-mono text-2xl font-bold text-foreground">{meta?.total ?? expenses.length}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Fuel Spend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fuelSpendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 16%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, "Spend"]} />
              <Bar dataKey="amount" fill="hsl(172, 66%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={costBreakdownData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={2}>
                {costBreakdownData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(220, 18%, 10%)", border: "1px solid hsl(220, 15%, 16%)", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search expenses…" className="h-8 bg-secondary/50 pl-9 text-xs" />
        </div>
        <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); setPage(1); }}>
          <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All categories</SelectItem>
            <SelectItem value="fuel" className="text-xs">Fuel</SelectItem>
            <SelectItem value="maintenance" className="text-xs">Maintenance</SelectItem>
            <SelectItem value="insurance" className="text-xs">Insurance</SelectItem>
            <SelectItem value="toll" className="text-xs">Tolls</SelectItem>
            <SelectItem value="other" className="text-xs">Other</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
      </div>

      {/* Expense table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        {loading ? (
          <div className="p-5"><SkeletonTable rows={5} /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Vehicle</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e: any) => (
                <tr key={e.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{e.expenseDate ? new Date(e.expenseDate).toLocaleDateString() : e.date || "—"}</td>
                  <td className="px-5 py-3 text-xs text-foreground">{e.vehicleName || (e.vehicle ? `${e.vehicle.make} ${e.vehicle.model}` : "—")}</td>
                  <td className="px-5 py-3"><StatusBadge status={(categoryColors[e.category] || "inactive") as any} label={e.category} /></td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{e.description}</td>
                  <td className="px-5 py-3 text-right font-mono text-xs font-medium text-foreground">${Number(e.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-xs text-muted-foreground">No expenses found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}
