import { hydrateAuth } from "@/api/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";

export default function RootLayout() {
  const { user, isHydrated } = useAuthStore();

  const router = useRouter();
  const segments = useSegments();


  useEffect(() => {
    const initialize = async () => {
      await hydrateAuth()
    }
    initialize()
  }, [])

  useEffect(() => {
    if (!isHydrated) return;

    const inAuthGroup =
      segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/Login");
    }

    if (user && inAuthGroup) {
      router.replace("/(tabs)");

    }
  }, [user, isHydrated, segments]);

  if (!isHydrated) {
    return <View style={{ "flex": 1, "justifyContent": "center", "alignItems": "center" }}>
      <ActivityIndicator color={"black"} />
    </View>;
  }
  return <Stack screenOptions={{ headerShown: false }} >
    <Stack.Screen name="(auth)/Login" />
    <Stack.Screen name="(auth)/Register" />
    <Stack.Screen name="(tabs)" />

  </Stack>;
}
