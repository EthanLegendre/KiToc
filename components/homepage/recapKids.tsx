import "@/global.css";
import { useEffect, useState } from "react";
import { ScrollView, Pressable, Text, View, Image, ActivityIndicator } from "react-native";
import { Child } from "@/types/enfant";
import { fetchAssmatKids } from "@/lib/fetch/fetchAssmatKids";
import {  } from "../parent/kidInformation";
import { News } from "@/types/news";
import { Ionicons } from "@expo/vector-icons";
import { fetchNewsSession } from "@/lib/fetch/fetchNewsSession";
type IoniconName = keyof typeof Ionicons.glyphMap;

const icon: IoniconName[] = ["time-outline", "fast-food-outline", "color-palette-outline", "bed-outline"];
const iconColor = ["#7C3AED", "#E84B9C", "#E0A63C", "#2FAE6B"];
const iconBgColor = ["bg-[#EDE4FB]", "bg-[#FBEAF2]", "bg-[#FBF1DC]", "bg-[#E3F5EA]"];
const timeSelect = ["Cette semaine", "Ce mois-ci", "Cette année", "Depuis le debut"];

function getTypeIcon(name: string) {
    if (name === "timing")
        return (0);
    if (name === "food")
        return (1);
    if (name === "activity")
        return (2);
    return (3);
}

function getHourMinuteNews(iso: string) {
    const date = new Date(iso);
    const h = date.getHours();
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}h${m}`
}

export function RecapKids() {
    const [kids, setKids] = useState<Child[] | null>(null)
    const [idKidSelect, setIdKidSelect] = useState(0);
    const [news, setNews] = useState<News[] | null>(null);
    const [newsLoading, setNewsLoading] = useState(true);

    useEffect(() => {
        fetchAssmatKids().then(({ data, error }) => {
        if (data) {
            setKids(data);
        }
        if (error) {
            console.error(error);
        }
        });
    }, []);

    useEffect(() => {
        async function getNews() {
            setNewsLoading(true);
            if (!kids) return;
            const { news, error } = await fetchNewsSession(kids[idKidSelect].id);
            if (error) {
                setNews(null);
                setNewsLoading(false);
                return;
            }
            setNews(news);
            setNewsLoading(false);
        }
        getNews();
    }, [idKidSelect])

    if (!kids) return;
    return (
        <View>
            <Text className="font-inter-bold text-[20px] mt-15 ml-6">Les récaps</Text>
            <Text className="font-inter-regular text-ink-faint mt-1 ml-6">Regardez en un coup d'oeil les récapitulatifs de la journée</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", gap: 10, paddingTop: 40, paddingHorizontal: 10}}>
                {kids.map((child, index) => (
                    <Pressable key={index} onPress={() => setIdKidSelect(index)}>
                        <View className={`flex-row items-center rounded-full pl-1 py-2 pr-4 border-1 ${index === idKidSelect ? "bg-[#f8e1fc] border-violet" : "border-ink-faint bg-white"}`}>
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
            </ScrollView>
            <View className="bg-white mt-10 rounded-[20px] shadow-lg pb-5">
                {newsLoading ? (<ActivityIndicator className="mt-5"/>) : (
                    (!news || news.length == 0) ? (
                        <View className="w-full justify-center items-center mt-5">
                            <Text className="text-ink-faint font-inter-semibold">Aucune news aujourd'hui</Text>
                        </View>
                    ) : (
                    <View className="mt-5 ml-6 mr-6">
                        {news.map((actu, index) => (
                            <View key={index}>
                                <View className="flex-row items-center">
                                    <View  className={`${iconBgColor[getTypeIcon(actu.type)]} ml-2 rounded-full h-8 w-8 items-center justify-center`}>
                                        <Ionicons name={icon[getTypeIcon(actu.type)]} size={16} color={iconColor[getTypeIcon(actu.type)]}/>
                                    </View>
                                    <Text className="ml-2 text-[12px] text-ink-faint font-inter-bold">{getHourMinuteNews(actu.createdAt)}</Text>
                                </View>
                                <View className="border-l-1 border-ink-faint w-full justify-center ml-6 pb-5 ">
                                    <Text className="font-inter-extrabold ml-4 text-[14px]">{actu.title}</Text>
                                    <Text className="font-inter-semibold text-ink-faint text-[12px] ml-4">{actu.description}</Text>
                                    {actu.photoUrl && (<Image className=" h-30 ml-4 rounded-[10px] mt-3 w-2/3" source={{ uri: actu.photoUrl}}></Image>)}
                                </View>
                            </View>
                        ))}
                    </View>
                )
                )}
            </View>
        </View>
  );
}
