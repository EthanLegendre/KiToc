import "@/global.css"

import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router";

import { TopLogo } from "@/components/topLogo";
import { AddKidForm } from "@/components/kid/addKidForm";


export default function AddKidPage() {
    const insets = useSafeAreaInsets();

    return (
        <ScrollView style={{ paddingTop: insets.top }} className="flex-1 bg-white" contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 40 }}>
            <TopLogo/>
            <View className="flex-row items-center mt-10">
                <Pressable className="bg-[#F2ECFB] rounded-full p-3" onPress={() => router.push("/homepage")}>
                    <Ionicons name="arrow-back-outline" size={20} color="#221733"/>
                </Pressable>
                <Text className="ml-3 font-bold text-[28px]">Ajouter un enfant</Text>
            </View>
            <AddKidForm/>
        </ScrollView>
    )
}
