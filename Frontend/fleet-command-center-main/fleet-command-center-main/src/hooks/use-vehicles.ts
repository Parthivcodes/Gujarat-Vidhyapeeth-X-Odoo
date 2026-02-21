import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    type VehicleFilters,
} from "@/lib/api/vehicles";

export function useVehicles(filters: VehicleFilters = {}) {
    return useQuery({
        queryKey: ["vehicles", filters],
        queryFn: () => getVehicles(filters),
    });
}

export function useCreateVehicle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => createVehicle(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
    });
}

export function useUpdateVehicle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) =>
            updateVehicle(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
    });
}

export function useDeleteVehicle() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => deleteVehicle(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
    });
}
