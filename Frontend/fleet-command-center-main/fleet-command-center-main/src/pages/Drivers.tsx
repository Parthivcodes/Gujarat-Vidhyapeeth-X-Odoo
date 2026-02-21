import { useState } from "react";
import { useDrivers } from "@/hooks/use-drivers";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SkeletonTable } from "@/components/common/SkeletonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, AlertTriangle, Shield } from "lucide-react";

function isExpiringSoon(date: string): boolean {
  if (!date) return false;
  const expiry = new Date(date);
  const now = new Date();
  const diff = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diff < 90;
}

export default function Drivers() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const driversQuery = useDrivers({
    search: search || undefined,
    per_page: 15,
    page,
  });

  const drivers = driversQuery.data?.data ?? [];
  const meta = driversQuery.data?.meta;
  const totalPages = meta?.lastPage ?? 1;
  const loading = driversQuery.isLoading;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search drivers…"
            className="h-8 bg-secondary/50 pl-9 text-xs"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        {loading ? (
          <div className="p-5"><SkeletonTable rows={5} /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Driver</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">License</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Expiry</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Safety Score</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Trips</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d: any) => {
                const name = d.name || d.user?.name || "Unknown";
                const expiring = isExpiringSoon(d.licenseExpiry);
                const score = Number(d.safetyScore) || 0;
                return (
                  <tr key={d.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {name.split(" ").map((n: string) => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-foreground">{name}</div>
                          <div className="text-[11px] text-muted-foreground">{d.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{d.licenseNumber}</td>
                    <td className="px-5 py-3">
                      <span className={`flex items-center gap-1 font-mono text-xs ${expiring ? "text-destructive" : "text-muted-foreground"}`}>
                        {expiring && <AlertTriangle className="h-3 w-3" />}
                        {d.licenseExpiry ? new Date(d.licenseExpiry).toLocaleDateString() : "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Shield className={`h-3.5 w-3.5 ${score >= 90 ? "text-success" : score >= 80 ? "text-warning" : "text-destructive"}`} />
                        <span className="font-mono text-xs font-semibold text-foreground">{score}</span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${score >= 90 ? "bg-success" : score >= 80 ? "bg-warning" : "bg-destructive"}`}
                            style={{ width: `${Math.min(score, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{d.totalTrips || 0}</td>
                    <td className="px-5 py-3"><StatusBadge status={d.status as any} /></td>
                  </tr>
                );
              })}
              {drivers.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-xs text-muted-foreground">No drivers found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
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
