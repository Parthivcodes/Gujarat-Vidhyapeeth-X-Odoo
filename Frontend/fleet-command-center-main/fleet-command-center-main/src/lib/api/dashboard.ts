import apiClient, { keysToCamel, type ApiResponse } from "@/lib/api-client";

export async function getDashboardKpis() {
    const { data } = await apiClient.get<ApiResponse<unknown>>(
        "/dashboard/kpis"
    );
    return keysToCamel(data.data);
}
