import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDrivers, createDriver, updateDriver, deleteDriver, type DriverFilters } from "@/lib/api/drivers";

export function useDrivers(filters: DriverFilters = {}) {
    return useQuery({
        queryKey: ["drivers", filters],
        queryFn: () => getDrivers(filters),
    });
}

export function useCreateDriver() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => createDriver(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
    });
}

export function useUpdateDriver() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) => updateDriver(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
    });
}

export function useDeleteDriver() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => deleteDriver(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["drivers"] }),
    });
}
