import { create } from "zustand";
import type { UserRole } from "@/lib/types";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AppState {
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  sidebarCollapsed: boolean;
  currentRole: UserRole;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
  toggleSidebar: () => void;
}

function loadInitialState() {
  const token = localStorage.getItem("ff_token");
  const userJson = localStorage.getItem("ff_user");
  if (token && userJson) {
    try {
      const user = JSON.parse(userJson) as AuthUser;
      return { isAuthenticated: true, currentUser: user, currentRole: (user.role || "fleet_manager") as UserRole };
    } catch {
      // corrupted – clear
      localStorage.removeItem("ff_token");
      localStorage.removeItem("ff_user");
    }
  }
  return { isAuthenticated: false, currentUser: null, currentRole: "fleet_manager" as UserRole };
}

const initial = loadInitialState();

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: initial.isAuthenticated,
  currentUser: initial.currentUser,
  sidebarCollapsed: false,
  currentRole: initial.currentRole,

  login: (token, user) => {
    localStorage.setItem("ff_token", token);
    localStorage.setItem("ff_user", JSON.stringify(user));
    set({
      isAuthenticated: true,
      currentUser: user,
      currentRole: (user.role || "fleet_manager") as UserRole,
    });
  },

  logout: () => {
    localStorage.removeItem("ff_token");
    localStorage.removeItem("ff_user");
    set({ isAuthenticated: false, currentUser: null });
  },

  setRole: (role) => set({ currentRole: role }),

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));
