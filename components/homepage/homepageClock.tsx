import "@/global.css";
import { User, fetchUser } from "@/lib/fetch/fetchUser";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export function HomepageClock() {
    const [user, setUser] = useState<User | null>(null);
    const [time, setTime] = useState(new Date());
    const heures = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    const dateShort = time.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    useEffect(() => {
        fetchUser("assmat").then(({ data, error }) => {
            setUser(data);
        })
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <View>
            <View className="w-full mt-10 rounded-[22px] bg-violet px-5 py-5 shadow-xl overflow-hidden relative">
                <View className="absolute -right-6 -top-8 w-24 h-24 rounded-full bg-white/10" />
                <View className="absolute right-10 bottom-[-30px] w-20 h-20 rounded-full bg-violet-deep/40" />
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
                        <View className="w-1.5 h-1.5 rounded-full bg-green" />
                        <Text className="text-white text-[11px] font-inter-bold">En direct</Text>
                    </View>
                    <Text className="text-white/70 text-[12px] font-inter-semibold">{dateShort}</Text>
                </View>
                <Text className="font-inter-extrabold text-[38px] text-white mt-4">{heures}:{minutes}</Text>
                <Text className="text-white/80 text-[14px] font-inter-semibold mt-1">Bonjour {user?.prenom}</Text>
                <View className="absolute right-5 top-[55%] w-11 h-11 rounded-full bg-rose items-center justify-center shadow-lg">
                    <Ionicons name="time-outline" size={18} color="#fff" />
                </View>
            </View>
        </View>
    )
}