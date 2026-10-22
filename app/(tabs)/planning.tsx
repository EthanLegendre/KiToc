import "@/global.css";
import { Text, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MainPlanning } from "@/components/mainPlanning";
import { TopLogo } from "@/components/topLogo";


export default function PlanningPage() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={{ paddingTop: insets.top }} className="flex-1" contentContainerStyle={{paddingBottom: insets.bottom + 40 }}>
      <View className="px-10 mt-5">
        <TopLogo/>
      </View>
      <Text className="font-black tracking-[2px] text-[30px] text-ink mt-10 px-10">Planning</Text>
      <MainPlanning />
    </ScrollView> 
  );
}
