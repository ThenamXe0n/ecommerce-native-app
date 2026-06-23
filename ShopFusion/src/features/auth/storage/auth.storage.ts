import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const authStorage = {
  async saveTokens(accessToken: string, refreshToken: string) {
    if (Platform.OS === "web") {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      return;
    }

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },
  async getAccessToken() {
    if (Platform.OS === "web") {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },
  async getRefreshToken() {
    if (Platform.OS) {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },
  async removeTokens() {
    if (Platform.OS === "web") {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return;
    }
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
