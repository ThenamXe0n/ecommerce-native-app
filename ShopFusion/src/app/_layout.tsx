import { hydrateAuth } from "@/api/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";

export default function RootLayout() {
  const { user, isHydrated } = useAuthStore();

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isHydrated) return;

    const inAuthGroup =
      segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/Login");
    }

    if (user && inAuthGroup) {
      router.replace("/(tabs)/index");
    }
  }, [user, isHydrated, segments]);

  if (!isHydrated) {
    return <View style={{ "flex": 1, "justifyContent": "center", "alignItems": "center" }}>
      {/* <ActivityIndicator color={"black"} /> */}
      <SplashScreen />
    </View>;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
