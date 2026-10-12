import { AddKidForm } from "@/components/parent/addKid";
import { HomepageTop } from "@/components/parent/homepageTop";
import { KidInformation } from "@/components/parent/kidInformation";
import { TopLogoParent } from "@/components/parent/topLogo";
import { checkParentHaveKid } from "@/lib/check/checkParentHaveKid";
import { fetchParentKids } from "@/lib/fetch/fetchParentKids";
import { handleSignOut } from "@/lib/handle/handleSignOut";
import { Child } from "@/types/enfant";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function App() {
    const insets = useSafeAreaInsets();
    const [haveKid, setHaveKid] = useState(false);
    const [kids, setKids] = useState<Child[] | null>(null)
    const [idKidSelect, setIdKidSelect] = useState(0);
    const [showForm, setShowForm] = useState(false);


    const refreshHaveKid = useCallback(() => {
        checkParentHaveKid().then(({ haveKidParent }) => {
            setHaveKid(haveKidParent);
        })
    }, []);

    useEffect(() => {
        async function getKid() {
            const { kids } = await fetchParentKids();
            if (!kids) return;
            setKids(kids);
        }
        getKid();
    }, [refreshHaveKid]);

    useEffect(() => {
        refreshHaveKid();
    }, [refreshHaveKid])

    return (
        <ScrollView style={{ paddingTop: insets.top, backgroundColor: "#F8F3FA"}} className="flex-1 bg-[#F8F3FA]" contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: insets.bottom + 40 }}>
            <TopLogoParent></TopLogoParent>
            <HomepageTop onKidAdded={refreshHaveKid}></HomepageTop>
            {!kids || kids.length === 0 ? (
                <View className="w-full h-full border-t-2 border-t-ink-faint mt-20 items-center justify-center">
                    <Ionicons name="lock-closed" size={100} color={"gray"}/>
                    <Text className="font-inter-regular">Veuiller rejoindre votre enfant</Text>
                    <Pressable style={{ borderStyle:"dashed"}} className="items-center justify-center h-12 py-2 border-1 border-violet rounded-full w-12 px-2" onPress={() => setShowForm(true)}>
                        <Text className="font-inter-extrabold">+</Text>
                    </Pressable>
                </View>
                ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", gap: 12, paddingVertical: 20, paddingHorizontal: 28 }}>
                        {kids.map((child, index) => (
                            <Pressable key={index} onPress={() => setIdKidSelect(index)}>
                                <View className={`flex-row items-center rounded-full pl-1 py-2 pr-4 border-1 ${index === idKidSelect ? "bg-[#f2e6ff] border-violet" : "border-ink-faint"}`}>
                                    { child.profilePictureUrl ? (
                                        <Image source={{ uri: child.profilePictureUrl}} className="w-10 h-10 rounded-full border-white border-2 shadow-lg"></Image>
                                    ) : (
                                        <View className={`w-10 h-10 items-center justify-center rounded-full bg-[${child.avatarColor}] border-2 shadow-lg border-white`}>
                                            <Text className="text-white font-inter-black text-[10px]">{child.firstname.slice(0, 1).toUpperCase()}</Text>
                                        </View>
                                    )}
                                    <Text className="ml-2 font-inter-bold">{child.firstname}</Text>
                                </View>
                            </Pressable>
                        ))}
                        <Pressable style={{ borderStyle:"dashed"}} className="items-center justify-center h-12 py-2 border-1 border-violet rounded-full w-12 px-2" onPress={() => setShowForm(true)}>
                            <Text className="font-inter-extrabold">+</Text>
                        </Pressable>
                    </ScrollView>
            )}
            <AddKidForm visible={showForm} onClose={() => {setShowForm(false);}}/>
            {kids && (
                <KidInformation child={kids[idKidSelect]}></KidInformation>
            )}
            <Pressable className="border-1 border-red-500 rounded-full w-1/4 items-center justify-center px-2 py-1 mt-20" onPress={() => {handleSignOut(); router.replace("/")}}>
                <Text className="text-red-500">Se déconnecter</Text>
            </Pressable>
        </ScrollView>
    )
}