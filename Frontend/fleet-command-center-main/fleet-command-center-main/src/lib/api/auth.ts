import apiClient, { keysToCamel, type ApiResponse } from "@/lib/api-client";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: AuthUser;
}

export interface MeResponse {
    id: number;
    name: string;
    email: string;
    status: string;
    role: string;
    permissions: string[];
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        payload
    );
    return keysToCamel<LoginResponse>(data.data);
}

export async function registerApi(
    payload: RegisterPayload
): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/register",
        payload
    );
    return keysToCamel<LoginResponse>(data.data);
}

export async function logoutApi(): Promise<void> {
    await apiClient.post("/auth/logout");
}

export async function refreshApi(): Promise<LoginResponse> {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
        "/auth/refresh"
    );
    return keysToCamel<LoginResponse>(data.data);
}

export async function getMeApi(): Promise<MeResponse> {
    const { data } = await apiClient.get<ApiResponse<MeResponse>>("/auth/me");
    return keysToCamel<MeResponse>(data.data);
}
