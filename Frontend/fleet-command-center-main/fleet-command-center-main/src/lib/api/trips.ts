import apiClient, {
    keysToCamel,
    keysToSnake,
    type PaginatedApiResponse,
    type ApiResponse,
} from "@/lib/api-client";
import type { Trip } from "@/lib/types";

export interface TripFilters {
    status?: string;
    vehicle_id?: number;
    driver_id?: number;
    date_from?: string;
    date_to?: string;
    search?: string;
    sort_by?: string;
    sort_dir?: string;
    per_page?: number;
    page?: number;
}

export async function getTrips(filters: TripFilters = {}) {
    const params = keysToSnake(filters) as Record<string, unknown>;
    const { data } = await apiClient.get<PaginatedApiResponse<Trip>>("/trips", {
        params,
    });
    return {
        data: keysToCamel<Trip[]>(data.data),
        meta: keysToCamel<{ currentPage: number; perPage: number; total: number; lastPage: number }>(data.meta),
    };
}

export async function getTrip(id: number | string) {
    const { data } = await apiClient.get<ApiResponse<Trip>>(`/trips/${id}`);
    return keysToCamel<Trip>(data.data);
}

export async function createTrip(payload: Record<string, unknown>) {
    const { data } = await apiClient.post<ApiResponse<Trip>>(
        "/trips",
        keysToSnake(payload)
    );
    return keysToCamel<Trip>(data.data);
}

export async function updateTrip(
    id: number | string,
    payload: Record<string, unknown>
) {
    const { data } = await apiClient.put<ApiResponse<Trip>>(
        `/trips/${id}`,
        keysToSnake(payload)
    );
    return keysToCamel<Trip>(data.data);
}

export async function updateTripStatus(
    id: number | string,
    status: string
) {
    const { data } = await apiClient.patch<ApiResponse<Trip>>(
        `/trips/${id}/status`,
        { status }
    );
    return keysToCamel<Trip>(data.data);
}

export async function deleteTrip(id: number | string) {
    await apiClient.delete(`/trips/${id}`);
}

export async function getTripCostBreakdown(id: number | string) {
    const { data } = await apiClient.get<ApiResponse<unknown>>(
        `/trips/${id}/cost-breakdown`
    );
    return keysToCamel(data.data);
}
