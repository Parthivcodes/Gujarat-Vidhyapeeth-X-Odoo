import apiClient, {
    keysToCamel,
    keysToSnake,
    type PaginatedApiResponse,
    type ApiResponse,
} from "@/lib/api-client";
import type { MaintenanceRecord } from "@/lib/types";

export interface MaintenanceFilters {
    vehicle_id?: number;
    status?: string;
    type?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_dir?: string;
    per_page?: number;
    page?: number;
}

export async function getMaintenanceLogs(filters: MaintenanceFilters = {}) {
    const params = keysToSnake(filters) as Record<string, unknown>;
    const { data } = await apiClient.get<PaginatedApiResponse<MaintenanceRecord>>(
        "/maintenance",
        { params }
    );
    return {
        data: keysToCamel<MaintenanceRecord[]>(data.data),
        meta: keysToCamel<{ currentPage: number; perPage: number; total: number; lastPage: number }>(data.meta),
    };
}

export async function getMaintenanceLog(id: number | string) {
    const { data } = await apiClient.get<ApiResponse<MaintenanceRecord>>(
        `/maintenance/${id}`
    );
    return keysToCamel<MaintenanceRecord>(data.data);
}

export async function createMaintenanceLog(payload: Record<string, unknown>) {
    const { data } = await apiClient.post<ApiResponse<MaintenanceRecord>>(
        "/maintenance",
        keysToSnake(payload)
    );
    return keysToCamel<MaintenanceRecord>(data.data);
}

export async function updateMaintenanceLog(
    id: number | string,
    payload: Record<string, unknown>
) {
    const { data } = await apiClient.put<ApiResponse<MaintenanceRecord>>(
        `/maintenance/${id}`,
        keysToSnake(payload)
    );
    return keysToCamel<MaintenanceRecord>(data.data);
}

export async function completeMaintenance(id: number | string) {
    const { data } = await apiClient.patch<ApiResponse<MaintenanceRecord>>(
        `/maintenance/${id}/complete`
    );
    return keysToCamel<MaintenanceRecord>(data.data);
}

export async function deleteMaintenanceLog(id: number | string) {
    await apiClient.delete(`/maintenance/${id}`);
}
