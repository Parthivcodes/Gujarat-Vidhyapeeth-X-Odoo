import { useState, useMemo } from "react";
import { useVehicles, useCreateVehicle, useDeleteVehicle } from "@/hooks/use-vehicles";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SkeletonTable } from "@/components/common/SkeletonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, ChevronUp, ChevronDown, MoreHorizontal, Rows3, Rows4 } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function Vehicles() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [compact, setCompact] = useState(false);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const perPage = 8;
  const { toast } = useToast();

  // Form state
  const [form, setForm] = useState({ licensePlate: "", make: "", model: "", year: "", type: "truck", capacityKg: "", fuelType: "diesel" });

  const vehiclesQuery = useVehicles({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    per_page: perPage,
    page,
  });

  const createMutation = useCreateVehicle();
  const deleteMutation = useDeleteVehicle();

  const vehicles = vehiclesQuery.data?.data ?? [];
  const meta = vehiclesQuery.data?.meta;
  const totalPages = meta?.lastPage ?? 1;
  const total = meta?.total ?? vehicles.length;
  const loading = vehiclesQuery.isLoading;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      {
        license_plate: form.licensePlate,
        make: form.make,
        model: form.model,
        year: parseInt(form.year) || new Date().getFullYear(),
        type: form.type,
        capacity_kg: parseFloat(form.capacityKg) || 0,
        fuel_type: form.fuelType,
      },
      {
        onSuccess: () => {
          setDialogOpen(false);
          setForm({ licensePlate: "", make: "", model: "", year: "", type: "truck", capacityKg: "", fuelType: "diesel" });
          toast({ title: "Vehicle created", description: "The vehicle has been added to your fleet." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to create vehicle.", variant: "destructive" });
        },
      }
    );
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search vehicles…"
            className="h-8 bg-secondary/50 pl-9 text-xs"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All statuses</SelectItem>
            <SelectItem value="available" className="text-xs">Available</SelectItem>
            <SelectItem value="in_use" className="text-xs">In Use</SelectItem>
            <SelectItem value="maintenance" className="text-xs">Maintenance</SelectItem>
            <SelectItem value="retired" className="text-xs">Retired</SelectItem>
          </SelectContent>
        </Select>
        <button
          onClick={() => setCompact(!compact)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground"
          title="Toggle density"
        >
          {compact ? <Rows4 className="h-3.5 w-3.5" /> : <Rows3 className="h-3.5 w-3.5" />}
        </button>
        <div className="flex-1" />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1.5 bg-primary text-primary-foreground text-xs hover:bg-primary/90">
              <Plus className="h-3.5 w-3.5" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs">Make</Label>
                  <Input value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} placeholder="e.g. Volvo" className="h-9 text-sm" required />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">Model</Label>
                  <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} placeholder="e.g. FH16" className="h-9 text-sm" required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs">License Plate</Label>
                <Input value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} placeholder="FL-0000-XX" className="h-9 text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs">Capacity (kg)</Label>
                  <Input type="number" value={form.capacityKg} onChange={(e) => setForm({ ...form, capacityKg: e.target.value })} placeholder="25000" className="h-9 text-sm" required />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">Year</Label>
                  <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="2024" className="h-9 text-sm" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-xs">Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="truck" className="text-xs">Truck</SelectItem>
                      <SelectItem value="van" className="text-xs">Van</SelectItem>
                      <SelectItem value="car" className="text-xs">Car</SelectItem>
                      <SelectItem value="bus" className="text-xs">Bus</SelectItem>
                      <SelectItem value="trailer" className="text-xs">Trailer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs">Fuel Type</Label>
                  <Select value={form.fuelType} onValueChange={(v) => setForm({ ...form, fuelType: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diesel" className="text-xs">Diesel</SelectItem>
                      <SelectItem value="petrol" className="text-xs">Petrol</SelectItem>
                      <SelectItem value="electric" className="text-xs">Electric</SelectItem>
                      <SelectItem value="hybrid" className="text-xs">Hybrid</SelectItem>
                      <SelectItem value="cng" className="text-xs">CNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={createMutation.isPending} className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
                {createMutation.isPending ? "Saving…" : "Save Vehicle"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        {loading ? (
          <div className="p-5"><SkeletonTable rows={5} /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Vehicle</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Plate</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Capacity</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Odometer</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fuel</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v: any) => (
                <tr key={v.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                  <td className={`px-5 ${compact ? "py-2" : "py-3"}`}>
                    <div className="font-medium text-foreground text-xs">{v.make} {v.model}</div>
                    <div className="text-[11px] text-muted-foreground">{v.type} · {v.year}</div>
                  </td>
                  <td className={`px-5 ${compact ? "py-2" : "py-3"} font-mono text-xs text-foreground`}>{v.licensePlate}</td>
                  <td className={`px-5 ${compact ? "py-2" : "py-3"} font-mono text-xs text-muted-foreground`}>{Number(v.capacityKg || 0).toLocaleString()} kg</td>
                  <td className={`px-5 ${compact ? "py-2" : "py-3"} font-mono text-xs text-muted-foreground`}>{Number(v.odometer || 0).toLocaleString()} km</td>
                  <td className={`px-5 ${compact ? "py-2" : "py-3"}`}>
                    <StatusBadge status={v.status as any} />
                  </td>
                  <td className={`px-5 ${compact ? "py-2" : "py-3"} text-xs text-muted-foreground`}>{v.fuelType}</td>
                  <td className={`px-5 ${compact ? "py-2" : "py-3"}`}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-xs">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs">View History</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs text-destructive" onClick={() => deleteMutation.mutate(v.id)}>Retire</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-xs text-muted-foreground">No vehicles found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {total} vehicle{total !== 1 ? "s" : ""} · Page {page} of {totalPages}
        </span>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
