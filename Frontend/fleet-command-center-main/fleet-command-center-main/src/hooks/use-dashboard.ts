import { useQuery } from "@tanstack/react-query";
import { getDashboardKpis } from "@/lib/api/dashboard";

export function useDashboardKpis() {
    return useQuery({
        queryKey: ["dashboard", "kpis"],
        queryFn: getDashboardKpis,
    });
}
