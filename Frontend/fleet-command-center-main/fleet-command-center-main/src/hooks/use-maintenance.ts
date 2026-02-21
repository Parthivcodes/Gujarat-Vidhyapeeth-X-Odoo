import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMaintenanceLogs, createMaintenanceLog, updateMaintenanceLog, completeMaintenance, deleteMaintenanceLog, type MaintenanceFilters } from "@/lib/api/maintenance";

export function useMaintenance(filters: MaintenanceFilters = {}) {
    return useQuery({
        queryKey: ["maintenance", filters],
        queryFn: () => getMaintenanceLogs(filters),
    });
}

export function useCreateMaintenance() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => createMaintenanceLog(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["maintenance"] }),
    });
}

export function useUpdateMaintenance() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) => updateMaintenanceLog(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["maintenance"] }),
    });
}

export function useCompleteMaintenance() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => completeMaintenance(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["maintenance"] }),
    });
}

export function useDeleteMaintenance() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => deleteMaintenanceLog(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["maintenance"] }),
    });
}
