import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react"

import { handleSaveNotifToken } from "@/lib/handle/handleSaveNotifToken";
import { fetchUser } from "@/lib/fetch/fetchUser";

export default function TabsLayout() {
    const insets = useSafeAreaInsets();

    useEffect(() => {
      async function init() {
        const { data: assmat } = await fetchUser("assmat");
        if (assmat) await handleSaveNotifToken(assmat.id);
      }
      init();
    }, []);

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#7C3AED",
            tabBarInactiveTintColor: "#B7A9C9",
            tabBarStyle: {
                height: 46 + insets.bottom,
                paddingBottom: insets.bottom,
                paddingTop: 8,
                borderTopWidth: 1.5,
                borderTopColor: "#EFE3F3",
            },
            tabBarLabelStyle: {
            fontSize: 10.5,
            fontWeight: "600",
            },
        }}>
            <Tabs.Screen name="homepage" options={{title: "Accueil", tabBarIcon: ({ color }) => (<Ionicons name="home-outline" color={color} size={25}></Ionicons>)}}></Tabs.Screen>
            <Tabs.Screen name="planning" options={{title: "planning",tabBarIcon: ({ color }) => (<Ionicons name="calendar-outline" color={color} size={25}></Ionicons>)}}></Tabs.Screen>
            <Tabs.Screen name="profil" options={{title: "profil",tabBarIcon: ({ color }) => (<Ionicons name="person-outline" color={color} size={25}></Ionicons>)}}></Tabs.Screen>
            <Tabs.Screen name="addKid" options={{href: null}}></Tabs.Screen>
            <Tabs.Screen name="kidInfo" options={{href: null,}}></Tabs.Screen>
            <Tabs.Screen name="editKid" options={{href: null,}}></Tabs.Screen>
        </Tabs>
    )
}