import apiClient, {
    keysToCamel,
    keysToSnake,
    type PaginatedApiResponse,
    type ApiResponse,
} from "@/lib/api-client";
import type { Vehicle } from "@/lib/types";

export interface VehicleFilters {
    status?: string;
    type?: string;
    fuel_type?: string;
    search?: string;
    sort_by?: string;
    sort_dir?: string;
    per_page?: number;
    page?: number;
}

export async function getVehicles(filters: VehicleFilters = {}) {
    const params = keysToSnake(filters) as Record<string, unknown>;
    const { data } = await apiClient.get<PaginatedApiResponse<Vehicle>>(
        "/vehicles",
        { params }
    );
    return {
        data: keysToCamel<Vehicle[]>(data.data),
        meta: keysToCamel<{ currentPage: number; perPage: number; total: number; lastPage: number }>(data.meta),
    };
}

export async function getVehicle(id: number | string) {
    const { data } = await apiClient.get<ApiResponse<Vehicle>>(
        `/vehicles/${id}`
    );
    return keysToCamel<Vehicle>(data.data);
}

export async function createVehicle(payload: Record<string, unknown>) {
    const { data } = await apiClient.post<ApiResponse<Vehicle>>(
        "/vehicles",
        keysToSnake(payload)
    );
    return keysToCamel<Vehicle>(data.data);
}

export async function updateVehicle(
    id: number | string,
    payload: Record<string, unknown>
) {
    const { data } = await apiClient.put<ApiResponse<Vehicle>>(
        `/vehicles/${id}`,
        keysToSnake(payload)
    );
    return keysToCamel<Vehicle>(data.data);
}

export async function deleteVehicle(id: number | string) {
    await apiClient.delete(`/vehicles/${id}`);
}

export async function getVehicleRoi(id: number | string) {
    const { data } = await apiClient.get<ApiResponse<unknown>>(
        `/vehicles/${id}/roi`
    );
    return keysToCamel(data.data);
}
