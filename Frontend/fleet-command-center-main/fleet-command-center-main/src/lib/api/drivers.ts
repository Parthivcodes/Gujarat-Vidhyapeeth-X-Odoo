import apiClient, {
    keysToCamel,
    keysToSnake,
    type PaginatedApiResponse,
    type ApiResponse,
} from "@/lib/api-client";
import type { Driver } from "@/lib/types";

export interface DriverFilters {
    status?: string;
    search?: string;
    license_valid?: boolean;
    sort_by?: string;
    sort_dir?: string;
    per_page?: number;
    page?: number;
}

export async function getDrivers(filters: DriverFilters = {}) {
    const params = keysToSnake(filters) as Record<string, unknown>;
    const { data } = await apiClient.get<PaginatedApiResponse<Driver>>(
        "/drivers",
        { params }
    );
    return {
        data: keysToCamel<Driver[]>(data.data),
        meta: keysToCamel<{ currentPage: number; perPage: number; total: number; lastPage: number }>(data.meta),
    };
}

export async function getDriver(id: number | string) {
    const { data } = await apiClient.get<ApiResponse<Driver>>(`/drivers/${id}`);
    return keysToCamel<Driver>(data.data);
}

export async function createDriver(payload: Record<string, unknown>) {
    const { data } = await apiClient.post<ApiResponse<Driver>>(
        "/drivers",
        keysToSnake(payload)
    );
    return keysToCamel<Driver>(data.data);
}

export async function updateDriver(
    id: number | string,
    payload: Record<string, unknown>
) {
    const { data } = await apiClient.put<ApiResponse<Driver>>(
        `/drivers/${id}`,
        keysToSnake(payload)
    );
    return keysToCamel<Driver>(data.data);
}

export async function deleteDriver(id: number | string) {
    await apiClient.delete(`/drivers/${id}`);
}

export async function getDriverPerformance(id: number | string) {
    const { data } = await apiClient.get<ApiResponse<unknown>>(
        `/drivers/${id}/performance`
    );
    return keysToCamel(data.data);
}
