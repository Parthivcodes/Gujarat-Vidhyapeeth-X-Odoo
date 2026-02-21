import { useQuery } from "@tanstack/react-query";
import {
    getFleetPerformance,
    getFinancialReport,
    getDriverRankings,
    getChartData,
} from "@/lib/api/analytics";

export function useFleetPerformance(period: string = "month") {
    return useQuery({
        queryKey: ["analytics", "fleet-performance", period],
        queryFn: () => getFleetPerformance(period),
    });
}

export function useFinancialReport(period: string = "month") {
    return useQuery({
        queryKey: ["analytics", "financial-report", period],
        queryFn: () => getFinancialReport(period),
    });
}

export function useDriverRankings(limit: number = 10) {
    return useQuery({
        queryKey: ["analytics", "driver-rankings", limit],
        queryFn: () => getDriverRankings(limit),
    });
}

export function useChartData(months: number = 6) {
    return useQuery({
        queryKey: ["analytics", "charts", months],
        queryFn: () => getChartData(months),
    });
}
