import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    loginApi,
    registerApi,
    logoutApi,
    getMeApi,
    type LoginPayload,
    type RegisterPayload,
} from "@/lib/api/auth";
import { useAppStore } from "@/stores/app-store";

export function useLogin() {
    const { login } = useAppStore();

    return useMutation({
        mutationFn: (payload: LoginPayload) => loginApi(payload),
        onSuccess: (data) => {
            login(data.accessToken, data.user);
        },
    });
}

export function useRegister() {
    const { login } = useAppStore();

    return useMutation({
        mutationFn: (payload: RegisterPayload) => registerApi(payload),
        onSuccess: (data) => {
            login(data.accessToken, data.user);
        },
    });
}

export function useLogout() {
    const { logout } = useAppStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => logoutApi(),
        onSettled: () => {
            logout();
            queryClient.clear();
        },
    });
}

export function useMe() {
    const { isAuthenticated } = useAppStore();

    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: getMeApi,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });
}
