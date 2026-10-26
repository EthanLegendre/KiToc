import { View, Image, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AddNewsForm } from "../news/addNewsForm";
import { useState } from "react";
import { router } from "expo-router";

type IoniconName = keyof typeof Ionicons.glyphMap;

const icon: IoniconName[] = ["time-outline", "fast-food-outline", "color-palette-outline", "bed-outline"];
const iconColor = ["#7C3AED", "#E84B9C", "#E0A63C", "#2FAE6B"];
const iconBgColor = ["bg-[#EDE4FB]", "bg-[#FBEAF2]", "bg-[#FBF1DC]", "bg-[#E3F5EA]"];

export function HomepageFastActions() {
    const [showAddNewsForm, setShowAddNewsForm] = useState(false);
    const [typeId, setTypeId] = useState(0);

    return (
        <View className="">
            <View>
                <Text className="font-inter-bold text-[20px]">Actions rapides</Text>
                <Text className="font-inter-regular text-ink-faint">Notez les moments importants</Text>
            </View>
            <View className="mt-8 flex-wrap gap-3 flex-row">
                <Pressable className="w-30 bg-white rounded-[16px] border-1 border-ink-faint" onPress={() => {setTypeId(0); setShowAddNewsForm(true)}}>
                    <View className="p-2 ml-4 mt-4 w-15 h-15 bg-[#EDE4FB] items-center justify-center rounded-[20px]">
                        <Ionicons className="" name={icon[0]} size={23} color={"#7C3AED"}></Ionicons>
                    </View>
                    <Text className="font-inter-semibold ml-4 mt-2 pb-4 text-[14px]">Horaire</Text>
                </Pressable>
                <Pressable className="w-30 bg-white rounded-[16px] border-1 border-ink-faint" onPress={() => {setTypeId(1); setShowAddNewsForm(true)}}>
                    <View className="p-2 ml-4 mt-4 w-15 h-15 bg-[#FBEAF2] items-center justify-center rounded-[20px]">
                        <Ionicons className="" name={icon[1]} size={23} color={"#E84B9C"}></Ionicons>
                    </View>
                    <Text className="font-inter-semibold ml-4 mt-2 pb-4 text-[14px]">Repas</Text>
                </Pressable>
                <Pressable className="w-30 bg-white rounded-[16px] border-1 border-ink-faint" onPress={() => {setTypeId(2); setShowAddNewsForm(true)}}>
                    <View className="p-2 ml-4 mt-4 w-15 h-15 bg-[#FBF1DC] items-center justify-center rounded-[20px]">
                        <Ionicons className="" name={icon[2]} size={23} color={"#E0A63C"}></Ionicons>
                    </View>
                    <Text className="font-inter-semibold ml-4 mt-2 pb-4 text-[14px]">Activités</Text>
                </Pressable>
                <Pressable className="w-30 bg-white rounded-[16px] border-1 border-ink-faint" onPress={() => {setTypeId(3); setShowAddNewsForm(true)}}>
                    <View className="p-2 ml-4 mt-4 w-15 h-15 bg-[#E3F5EA] items-center justify-center rounded-[20px]">
                        <Ionicons className="" name={icon[3]} size={23} color={"#2FAE6B"}></Ionicons>
                    </View>
                    <Text className="font-inter-semibold ml-4 mt-2 pb-4 text-[14px]">Sieste</Text>
                </Pressable>
                <Pressable className="w-30 bg-white rounded-[16px] border-1 border-ink-faint">
                    <View className="p-2 ml-4 mt-4 w-15 h-15 bg-[#E5F0FC] items-center justify-center rounded-[20px]">
                        <Ionicons className="" name="camera-outline" size={23} color={"#4C9AF2"}></Ionicons>
                    </View>
                    <Text className="font-inter-semibold ml-4 mt-2 pb-4 text-[14px]">Photos</Text>
                </Pressable>
                <Pressable className="w-30 bg-white rounded-[16px] border-1 border-ink-faint" onPress={() => {router.replace("/planning")}}>
                    <View className="p-2 ml-4 mt-4 w-15 h-15 bg-[#EDE4FB] items-center justify-center rounded-[20px]">
                        <Ionicons className="" name="calendar-outline" size={23} color={"#9B6FE8"}></Ionicons>
                    </View>
                    <Text className="font-inter-semibold ml-4 mt-2 pb-4 text-[14px]">Planning</Text>
                </Pressable>
                <Pressable className="w-30 bg-white rounded-[16px] border-1 border-ink-faint">
                    <View className="p-2 ml-4 mt-4 w-15 h-15 bg-[#FBE4EE] items-center justify-center rounded-[20px]">
                        <Ionicons className="" name="document-text-outline" size={23} color={"#E8508F"}></Ionicons>
                    </View>
                    <Text className="font-inter-semibold ml-4 mt-2 pb-4 text-[14px]">Récap</Text>
                </Pressable>
            </View>
            {showAddNewsForm && (
                <AddNewsForm visible={showAddNewsForm} typeId={typeId} onClose={() => setShowAddNewsForm(false)}></AddNewsForm>
            )}
        </View> 
    )  
};