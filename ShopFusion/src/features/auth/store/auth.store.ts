import { create } from "zustand";
import { AuthState, User } from "../types";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,

  setHydrate: (value) => {
    set({
      isHydrated: value,
    });
  },

  setAuth: ({ user, accessToken, refreshToken }) =>
    set({
      user,
      accessToken,
      refreshToken,
    }),
  updateAccessToken: (accessToken) =>
    set({
      accessToken,
    }),

  setUser: (user: User) => {
    set({ user });
  },
  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    }),
}));
