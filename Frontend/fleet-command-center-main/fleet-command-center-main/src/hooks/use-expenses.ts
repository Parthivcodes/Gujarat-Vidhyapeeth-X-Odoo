import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, createExpense, updateExpense, deleteExpense, type ExpenseFilters } from "@/lib/api/expenses";

export function useExpenses(filters: ExpenseFilters = {}) {
    return useQuery({
        queryKey: ["expenses", filters],
        queryFn: () => getExpenses(filters),
    });
}

export function useCreateExpense() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: Record<string, unknown>) => createExpense(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
    });
}

export function useUpdateExpense() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number | string; data: Record<string, unknown> }) => updateExpense(id, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
    });
}

export function useDeleteExpense() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number | string) => deleteExpense(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
    });
}
