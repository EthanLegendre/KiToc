import "@/global.css";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View, ScrollView } from "react-native";
import { Link } from "expo-router";

import { TopLogo } from "@/components/topLogo";
import { TopLogin } from "@/components/login/loginTop";
import { LoginForm } from "@/components/login/loginForm";
import { GoogleOrApple } from "@/components/googleOrApple";


export default function LoginPage() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={{ paddingTop: insets.top }} className="flex-1 bg-white" contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: insets.bottom + 40 }}>
      <TopLogo/>
      <TopLogin/>
      <Text className="mt-8 font-inter-extrabold text-[29px]">Heureux de vous revoir</Text>
      <Text className="mt-2 text-ink-soft font-inter-regular text-[15px]">Connectez-vous pour retrouver votre espace.</Text>
      <LoginForm/>
      <GoogleOrApple />
      <View className="flex-row mt-8 gap-3 self-center mb-10">
        <Text className="text-ink-faint font-inter-semibold text-[14px]">Pas encore de compte ? <Link href={"/register"} replace className="text-violet font-inter-bold"> Créer un compte</Link></Text>
      </View>
    </ScrollView>
  );
}
