import "@/global.css";
import { fetchUser, User } from "@/lib/fetch/fetchUser";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

type Props = {
    onKidAdded: () => void;
}

export function HomepageTop({ onKidAdded }: Props) {
    const date = new Date();
    const datestring = date.toLocaleDateString("fr-FR", {weekday: "long", day: "numeric", month: "long"});
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUser("parent").then(({ data, error }) => {
            if (data) setUser(data);
            if (error) console.error(error);
        })
    })

    if (!user) return;

    return (
        <View className="mt-10 flex-row justify-between items-center px-6">
            <View>
                <Text className="text-ink-soft font-inter-regular text-[20px]">{datestring.slice(0, 1).toUpperCase()}{datestring.slice(1)}</Text>
                <Text className="text-[30px] font-inter-extrabold mt-2">Bonjour {user.prenom}</Text>
            </View>
        </View>
    )
}