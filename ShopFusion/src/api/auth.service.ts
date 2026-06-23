import { authStorage } from "@/features/auth/storage/auth.storage";
import { api } from "./axios";
import { useAuthStore } from "@/features/auth/store/auth.store";

type LoginPayload = {
  email: string;
  password: string;
};

export const login = async (payload: LoginPayload) => {
  const { data: response } = await api.post("/auth/login", payload);
  return response;
};

export const hydrateAuth = async () => {
  try {
    const accessToken = await authStorage.getAccessToken();
    const refreshToken = await authStorage.getRefreshToken();

    if (!refreshToken || !accessToken) {
      return;
    }
    useAuthStore.setState({
      accessToken,
      refreshToken,
    });

    const response = await getCurrentUser();

    useAuthStore.getState().setUser(response.data);
    useAuthStore.getState().setHydrate(true);
  } catch (error) {
    await authStorage.removeTokens();
    useAuthStore.getState().logout();
    useAuthStore.getState().setHydrate(true);
  }finally{
    useAuthStore.getState().setHydrate(true)
  }
};

export const getCurrentUser = async () => {
  const { data: response } = await api.get("/auth/me");

  return response;
};
