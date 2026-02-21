import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTrips, createTrip, updateTrip, updateTripStatus, deleteTrip, type TripFilters } from "@/lib/api/trips";

export function useTrips(filters: TripFilters = {}) {
    return useQuery({
        queryKey: ["trips", filters],
        queryFn: () => getTrips(filters),
    });
}

export function useCreateTrip() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => createTrip(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
    });
}

export function useUpdateTrip() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) => updateTrip(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
    });
}

export function useUpdateTripStatus() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: number | string; status: string }) => updateTripStatus(id, status),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
    });
}

export function useDeleteTrip() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => deleteTrip(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["trips"] }),
    });
}
