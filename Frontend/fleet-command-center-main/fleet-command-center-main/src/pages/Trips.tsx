import { useState } from "react";
import { useTrips, useCreateTrip, useUpdateTripStatus } from "@/hooks/use-trips";
import { useVehicles } from "@/hooks/use-vehicles";
import { useDrivers } from "@/hooks/use-drivers";
import { StatusBadge } from "@/components/common/StatusBadge";
import { SkeletonTable } from "@/components/common/SkeletonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Search, Plus, MoreHorizontal, MapPin, ArrowRight } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function Trips() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const { toast } = useToast();

  // Wizard form state
  const [tripForm, setTripForm] = useState({
    origin: "", destination: "", scheduledAt: "",
    vehicleId: "", driverId: "",
    cargoDescription: "", cargoWeightKg: "", distanceKm: "",
  });

  const tripsQuery = useTrips({
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    per_page: 15,
    page,
  });

  const vehiclesQuery = useVehicles({ status: "available", per_page: 100 });
  const driversQuery = useDrivers({ status: "available", per_page: 100 });
  const createMutation = useCreateTrip();
  const statusMutation = useUpdateTripStatus();

  const trips = tripsQuery.data?.data ?? [];
  const meta = tripsQuery.data?.meta;
  const totalPages = meta?.lastPage ?? 1;
  const loading = tripsQuery.isLoading;

  const activeVehicles = vehiclesQuery.data?.data ?? [];
  const activeDrivers = driversQuery.data?.data ?? [];

  const steps = ["Route Details", "Assignment", "Cargo & Confirm"];

  const handleCreateTrip = () => {
    createMutation.mutate(
      {
        vehicle_id: parseInt(tripForm.vehicleId),
        driver_id: parseInt(tripForm.driverId),
        origin: tripForm.origin,
        destination: tripForm.destination,
        distance_km: parseFloat(tripForm.distanceKm) || undefined,
        cargo_weight_kg: parseFloat(tripForm.cargoWeightKg) || undefined,
        cargo_description: tripForm.cargoDescription || undefined,
        scheduled_at: tripForm.scheduledAt || undefined,
      },
      {
        onSuccess: () => {
          setWizardOpen(false);
          setWizardStep(0);
          setTripForm({ origin: "", destination: "", scheduledAt: "", vehicleId: "", driverId: "", cargoDescription: "", cargoWeightKg: "", distanceKm: "" });
          toast({ title: "Trip created", description: "The trip has been created as a draft." });
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to create trip.", variant: "destructive" });
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
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search trips…" className="h-8 bg-secondary/50 pl-9 text-xs" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All statuses</SelectItem>
            <SelectItem value="draft" className="text-xs">Draft</SelectItem>
            <SelectItem value="dispatched" className="text-xs">Dispatched</SelectItem>
            <SelectItem value="in_progress" className="text-xs">In Progress</SelectItem>
            <SelectItem value="completed" className="text-xs">Completed</SelectItem>
            <SelectItem value="cancelled" className="text-xs">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Dialog open={wizardOpen} onOpenChange={(o) => { setWizardOpen(o); if (!o) setWizardStep(0); }}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1.5 bg-primary text-primary-foreground text-xs hover:bg-primary/90">
              <Plus className="h-3.5 w-3.5" /> Create Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Create New Trip</DialogTitle></DialogHeader>
            {/* Step indicator */}
            <div className="flex items-center gap-2 border-b border-border pb-4">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${i <= wizardStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                  <span className={`text-xs ${i <= wizardStep ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
                  {i < steps.length - 1 && <div className="h-px w-6 bg-border" />}
                </div>
              ))}
            </div>
            <div className="space-y-4 py-2">
              {wizardStep === 0 && (
                <>
                  <div className="grid gap-2">
                    <Label className="text-xs">Origin</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-success" />
                      <Input value={tripForm.origin} onChange={(e) => setTripForm({ ...tripForm, origin: e.target.value })} placeholder="e.g. Dallas, TX" className="h-9 pl-9 text-sm" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">Destination</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-destructive" />
                      <Input value={tripForm.destination} onChange={(e) => setTripForm({ ...tripForm, destination: e.target.value })} placeholder="e.g. Houston, TX" className="h-9 pl-9 text-sm" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">Departure Date</Label>
                    <Input type="date" value={tripForm.scheduledAt} onChange={(e) => setTripForm({ ...tripForm, scheduledAt: e.target.value })} className="h-9 text-sm" />
                  </div>
                </>
              )}
              {wizardStep === 1 && (
                <>
                  <div className="grid gap-2">
                    <Label className="text-xs">Vehicle</Label>
                    <Select value={tripForm.vehicleId} onValueChange={(v) => setTripForm({ ...tripForm, vehicleId: v })}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select available vehicle" /></SelectTrigger>
                      <SelectContent>
                        {activeVehicles.map((v: any) => (
                          <SelectItem key={v.id} value={String(v.id)} className="text-xs">{v.make} {v.model} — {v.licensePlate}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">Driver</Label>
                    <Select value={tripForm.driverId} onValueChange={(v) => setTripForm({ ...tripForm, driverId: v })}>
                      <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select available driver" /></SelectTrigger>
                      <SelectContent>
                        {activeDrivers.map((d: any) => (
                          <SelectItem key={d.id} value={String(d.id)} className="text-xs">{d.name || d.user?.name || "Driver"}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              {wizardStep === 2 && (
                <>
                  <div className="grid gap-2">
                    <Label className="text-xs">Cargo Description</Label>
                    <Input value={tripForm.cargoDescription} onChange={(e) => setTripForm({ ...tripForm, cargoDescription: e.target.value })} placeholder="e.g. Electronics" className="h-9 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-xs">Cargo Weight (kg)</Label>
                      <Input type="number" value={tripForm.cargoWeightKg} onChange={(e) => setTripForm({ ...tripForm, cargoWeightKg: e.target.value })} placeholder="18500" className="h-9 text-sm" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs">Distance (km)</Label>
                      <Input type="number" value={tripForm.distanceKm} onChange={(e) => setTripForm({ ...tripForm, distanceKm: e.target.value })} placeholder="385" className="h-9 text-sm" />
                    </div>
                  </div>
                  <div className="rounded-md border border-dashed border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
                    Trip will be created as <StatusBadge status="draft" className="mx-1" /> and can be dispatched after review.
                  </div>
                </>
              )}
            </div>
            <DialogFooter className="gap-2">
              {wizardStep > 0 && (
                <Button variant="outline" size="sm" className="text-xs" onClick={() => setWizardStep(wizardStep - 1)}>Back</Button>
              )}
              {wizardStep < steps.length - 1 ? (
                <Button size="sm" className="bg-primary text-primary-foreground text-xs hover:bg-primary/90" onClick={() => setWizardStep(wizardStep + 1)}>Continue</Button>
              ) : (
                <Button size="sm" className="bg-primary text-primary-foreground text-xs hover:bg-primary/90" disabled={createMutation.isPending} onClick={handleCreateTrip}>
                  {createMutation.isPending ? "Creating…" : "Create Trip"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Trips Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto">
        {loading ? (
          <div className="p-5"><SkeletonTable rows={5} /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Trip</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Route</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Driver</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Vehicle</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cargo</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Distance</th>
                <th className="px-5 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {trips.map((trip: any) => (
                <tr key={trip.id} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs font-medium text-primary">{trip.tripCode || `#${trip.id}`}</span>
                    <div className="text-[11px] text-muted-foreground">{trip.scheduledAt ? new Date(trip.scheduledAt).toLocaleDateString() : "—"}</div>
                  </td>
                  <td className="px-5 py-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-foreground">{trip.origin}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="text-foreground">{trip.destination}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-foreground">{trip.driverName || trip.driver?.user?.name || "—"}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{trip.vehicleName || (trip.vehicle ? `${trip.vehicle.make} ${trip.vehicle.model}` : "—")}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {trip.cargoDescription || "—"}
                    {trip.cargoWeightKg && <span className="ml-1 font-mono text-[11px]">({Number(trip.cargoWeightKg).toLocaleString()}kg)</span>}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={trip.status as any} /></td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-muted-foreground">{Number(trip.distanceKm || 0).toLocaleString()} km</td>
                  <td className="px-5 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-xs">View Details</DropdownMenuItem>
                        {trip.status === "draft" && (
                          <DropdownMenuItem className="text-xs" onClick={() => statusMutation.mutate({ id: trip.id, status: "dispatched" })}>Dispatch</DropdownMenuItem>
                        )}
                        {(trip.status === "draft" || trip.status === "dispatched") && (
                          <DropdownMenuItem className="text-xs text-destructive" onClick={() => statusMutation.mutate({ id: trip.id, status: "cancelled" })}>Cancel</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-xs text-muted-foreground">No trips found</td></tr>
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
