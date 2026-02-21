import apiClient, {
    keysToCamel,
    keysToSnake,
    type PaginatedApiResponse,
    type ApiResponse,
} from "@/lib/api-client";
import type { Expense } from "@/lib/types";

export interface ExpenseFilters {
    category?: string;
    vehicle_id?: number;
    date_from?: string;
    date_to?: string;
    search?: string;
    sort_by?: string;
    sort_dir?: string;
    per_page?: number;
    page?: number;
}

export async function getExpenses(filters: ExpenseFilters = {}) {
    const params = keysToSnake(filters) as Record<string, unknown>;
    const { data } = await apiClient.get<PaginatedApiResponse<Expense>>(
        "/expenses",
        { params }
    );
    return {
        data: keysToCamel<Expense[]>(data.data),
        meta: keysToCamel<{ currentPage: number; perPage: number; total: number; lastPage: number }>(data.meta),
    };
}

export async function getExpense(id: number | string) {
    const { data } = await apiClient.get<ApiResponse<Expense>>(
        `/expenses/${id}`
    );
    return keysToCamel<Expense>(data.data);
}

export async function createExpense(payload: Record<string, unknown>) {
    const { data } = await apiClient.post<ApiResponse<Expense>>(
        "/expenses",
        keysToSnake(payload)
    );
    return keysToCamel<Expense>(data.data);
}

export async function updateExpense(
    id: number | string,
    payload: Record<string, unknown>
) {
    const { data } = await apiClient.put<ApiResponse<Expense>>(
        `/expenses/${id}`,
        keysToSnake(payload)
    );
    return keysToCamel<Expense>(data.data);
}

export async function deleteExpense(id: number | string) {
    await apiClient.delete(`/expenses/${id}`);
}
