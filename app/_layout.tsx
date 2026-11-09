import "@/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black,
} from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync(); // garde le splash visible au lancement

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black,
  });

  useEffect(() => {
    if (fontError) console.error("Erreur chargement polices :", fontError);
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null; // le splash reste affiché pendant ce temps

  return <Stack screenOptions={{ headerShown: false }} />;
}