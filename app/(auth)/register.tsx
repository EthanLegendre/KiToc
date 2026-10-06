import "@/global.css";
import { Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { TopLogo } from "@/components/topLogo";
import { RegisterTop } from "@/components/register/registerTop";
import { RegisterForm } from "@/components/register/registerForm";
import { GoogleOrApple } from "@/components/googleOrApple";

export default function App() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: insets.bottom + 40 }}
    >
      <TopLogo />
      <RegisterTop />
      <Text className="mt-7 font-inter-extrabold text-[30px]">Créer ton compte</Text>
      <Text className="mt-2 text-ink-soft font-inter-regular text-[15px]">
        Rejoins KiToc en moins d'une minute.
      </Text>
      <RegisterForm />
      <GoogleOrApple />
      <View className="flex-row mt-8 gap-3 mb-10 self-center">
        <Text className="text-ink-faint font-inter-semibold text-[14px]">
          Déja un compte ?{" "}
          <Link href={"/login"} replace className="text-violet font-inter-bold">
            Se connecter
          </Link>
        </Text>
      </View>
    </ScrollView>
  );
}
