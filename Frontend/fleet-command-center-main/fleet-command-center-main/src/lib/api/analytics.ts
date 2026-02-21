import apiClient, { keysToCamel, type ApiResponse } from "@/lib/api-client";

export async function getFleetPerformance(period: string = "month") {
    const { data } = await apiClient.get<ApiResponse<unknown>>(
        "/analytics/fleet-performance",
        { params: { period } }
    );
    return keysToCamel(data.data);
}

export async function getFinancialReport(period: string = "month") {
    const { data } = await apiClient.get<ApiResponse<unknown>>(
        "/analytics/financial-report",
        { params: { period } }
    );
    return keysToCamel(data.data);
}

export async function getDriverRankings(limit: number = 10) {
    const { data } = await apiClient.get<ApiResponse<unknown>>(
        "/analytics/driver-rankings",
        { params: { limit } }
    );
    return keysToCamel(data.data);
}

export async function getChartData(months: number = 6) {
    const { data } = await apiClient.get<ApiResponse<any>>(
        "/analytics/charts",
        { params: { months } }
    );
    return keysToCamel(data.data) as any;
}
