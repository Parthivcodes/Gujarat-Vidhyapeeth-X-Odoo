import { useState } from "react";
import { useMaintenance, useCreateMaintenance } from "@/hooks/use-maintenance";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SkeletonTable } from "@/components/common/SkeletonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, ChevronDown, ChevronRight } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useVehicles } from "@/hooks/use-vehicles";
import { useToast } from "@/hooks/use-toast";
import type { MaintenanceType } from "@/lib/types";

const typeColors: Record<string, string> = {
  preventive: "dispatched",
  corrective: "warning",
  routine: "dispatched",
  repair: "warning",
  inspection: "active",
  emergency: "danger",
};

export default function Maintenance() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [form, setForm] = useState({ vehicleId: "", type: "preventive", description: "", cost: "", scheduledDate: "", serviceProvider: "" });

  const maintenanceQuery = useMaintenance({ per_page: 15, page });
  const vehiclesQuery = useVehicles({ per_page: 100 });
  const createMutation = useCreateMaintenance();

  const records = maintenanceQuery.data?.data ?? [];
  const meta = maintenanceQuery.data?.meta;
  const totalPages = meta?.lastPage ?? 1;
  const loading = maintenanceQuery.isLoading;
  const vehicles = vehiclesQuery.data?.data ?? [];

  const filtered = search
    ? records.filter((m: any) => {
      const q = search.toLowerCase();
      return (m.vehicleName || m.vehicle?.make || "").toLowerCase().includes(q) || (m.description || "").toLowerCase().includes(q);
    })
    : records;

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        vehicle_id: parseInt(form.vehicleId),
        type: form.type,
        description: form.description,
        cost: parseFloat(form.cost) || 0,
        scheduled_date: form.scheduledDate,
        service_provider: form.serviceProvider || undefined,
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setForm({ vehicleId: "", type: "preventive", description: "", cost: "", scheduledDate: "", serviceProvider: "" });
          toast({ title: "Service logged", description: "Maintenance record created." });
        },
        onError: () => toast({ title: "Error", description: "Failed to log service.", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search maintenance…" className="h-8 bg-secondary/50 pl-9 text-xs" />
        </div>
        <div className="flex-1" />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1.5 bg-primary text-primary-foreground text-xs hover:bg-primary/90">
              <Plus className="h-3.5 w-3.5" /> Log Service
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Log Service Record</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="text-xs">Vehicle</Label>
                <Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v: any) => (
                      <SelectItem key={v.id} value={String(v.id)} className="text-xs">{v.make} {v.model} — {v.licensePlate}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventive" className="text-xs">Preventive</SelectItem>
                    <SelectItem value="corrective" className="text-xs">Corrective</SelectItem>
                    <SelectItem value="inspection" className="text-xs">Inspection</SelectItem>
                    <SelectItem value="emergency" className="text-xs">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs">Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Service details" className="h-9 text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs">Cost ($)</Label>
                  <Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} placeholder="0.00" className="h-9 text-sm" />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">Date</Label>
                  <Input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} className="h-9 text-sm" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs">Service Provider</Label>
                <Input value={form.serviceProvider} onChange={(e) => setForm({ ...form, serviceProvider: e.target.value })} placeholder="e.g. FleetCare Center" className="h-9 text-sm" />
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {createMutation.isPending ? "Saving…" : "Save Record"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border bg-card">
        {loading ? (
          <div className="p-5"><SkeletonTable rows={5} /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="w-8 px-3 py-2.5" />
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Vehicle</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Cost</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m: any) => (
                <>
                  <tr key={m.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30 cursor-pointer" onClick={() => toggle(String(m.id))}>
                    <td className="px-3 py-3 text-muted-foreground">
                      {expanded.has(String(m.id)) ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </td>
                    <td className="px-5 py-3 text-xs font-medium text-foreground">{m.vehicleName || (m.vehicle ? `${m.vehicle.make} ${m.vehicle.model}` : "—")}</td>
                    <td className="px-5 py-3"><StatusBadge status={(typeColors[m.type] || "active") as any} label={m.type} /></td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{m.description}</td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{m.scheduledDate ? new Date(m.scheduledDate).toLocaleDateString() : m.date || "—"}</td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-foreground">${Number(m.cost || 0).toLocaleString()}</td>
                    <td className="px-5 py-3"><StatusBadge status={m.status as any} /></td>
                  </tr>
                  {expanded.has(String(m.id)) && (
                    <tr key={`${m.id}-detail`} className="border-b border-border/50 bg-secondary/20">
                      <td colSpan={7} className="px-12 py-4">
                        <div className="grid grid-cols-3 gap-6 text-xs">
                          <div><span className="text-muted-foreground">Vendor:</span> <span className="text-foreground">{m.serviceProvider || m.vendor || "—"}</span></div>
                          <div><span className="text-muted-foreground">Odometer:</span> <span className="font-mono text-foreground">{Number(m.odometerAtService || 0).toLocaleString()} km</span></div>
                          <div><span className="text-muted-foreground">Record ID:</span> <span className="font-mono text-primary">#{m.id}</span></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-xs text-muted-foreground">No maintenance records found</td></tr>
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
