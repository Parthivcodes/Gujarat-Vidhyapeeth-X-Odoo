import axios from "axios";

const apiClient = axios.create({
    baseURL: "/api/v1",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Attach JWT token to every request
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("ff_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses (token expired / invalid)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("ff_token");
            localStorage.removeItem("ff_user");
            window.location.href = "/auth";
        }
        return Promise.reject(error);
    }
);

// ------- snake_case ↔ camelCase helpers -------

export function snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function keysToCamel<T>(obj: unknown): T {
    if (Array.isArray(obj)) return obj.map((v) => keysToCamel(v)) as T;
    if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
        return Object.fromEntries(
            Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
                snakeToCamel(k),
                keysToCamel(v),
            ])
        ) as T;
    }
    return obj as T;
}

export function keysToSnake(obj: unknown): unknown {
    if (Array.isArray(obj)) return obj.map((v) => keysToSnake(v));
    if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
        return Object.fromEntries(
            Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
                camelToSnake(k),
                keysToSnake(v),
            ])
        );
    }
    return obj;
}

// ------- Response types -------

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: Record<string, unknown>;
}

export interface PaginationMeta {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
}

export interface PaginatedApiResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    meta: PaginationMeta;
}

export default apiClient;
