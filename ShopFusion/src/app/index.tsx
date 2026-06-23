import { authStorage } from "@/features/auth/storage/auth.storage";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Link } from "expo-router";
import { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  const { user, isHydrated } = useAuthStore()

  useEffect(() => {
    console.log("hydrate status", isHydrated)
    console.log("user",user)
    const checkToken = async () => {
      const token = await authStorage.getAccessToken();
    };
    
    checkToken();
    
    console.log("hydrate status", isHydrated)
    console.log("user",user)
  }, [isHydrated, user]);


  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
      <Link href={"/(auth)/Login"}>Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
