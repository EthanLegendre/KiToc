import { fetchActiveSessionKid } from "@/lib/fetch/fetchActiveSessionKid";
import { fetchAssmatOfKid } from "@/lib/fetch/fetchAssmatOfKid";
import { fetchNewsSession } from "@/lib/fetch/fetchNewsSession";
import { fetchSessionInfoTimeKidMonth } from "@/lib/fetch/fetchSessionInfoTimeKidMonth";
import { User } from "@/lib/fetch/fetchUser";
import { calculeTimeHour } from "@/lib/utils/calculeTimeHour";
import { Child } from "@/types/enfant";
import { News } from "@/types/news";
import { session } from "@/types/session";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
    child: Child;
}

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

export function KidInformation({ child }: Props) {
    const [session, setSession] = useState<session | null>(null);
    const [timeSpend, setTimeSpend] = useState("");
    const date = new Date();
    const [assmat, setAssmat] = useState<User | null>(null)
    const [tdg, setTdg] = useState("0");
    const [nbrSession, setNrbSession] = useState("0");
    const [totalMoney, setTotalMoney] = useState("0");
    const [news, setNews] = useState<News[] | null>(null);
    const [timeSelectId, setTimeSelectId] = useState(1);

    useEffect(() => {
        setNews(null);
        async function getSession() {
            const { data, error } = await fetchActiveSessionKid(child.id);
            setSession(data);
            if (data) {
                const heureActuelle = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
                setTimeSpend(calculeTimeHour(data.start, heureActuelle));
            } else {
                setTimeSpend("");
            }
            if (error) console.error(error);
        }

        async function getAssmat() {
            const { assmat, error } = await fetchAssmatOfKid(child.id);
            if (error) {
                console.error(error)
                return;
            }
            setAssmat(assmat);
        }

        async function getInfoTime() {
            const { totalHour, totalSession, totalMoney} = await fetchSessionInfoTimeKidMonth(child.id, child.hourlyWageRate, child.dailyAllowance, false);
            setTdg(totalHour);
            setNrbSession(totalSession);
            setTotalMoney(totalMoney);
        }

        async function getNews() {
            const { news, error } = await fetchNewsSession(child.id);
            if (error) {
                return;
            }
            setNews(news);
        }

        getSession();
        getAssmat();
        getInfoTime();
        getNews();
    }, [child.id]);

    if (!assmat) return;

    return (
        <View className="mt-10">
            <View className="px-6">
                <View className="bg-white pb-8 w-full border-[1px] border-[#fbd7fc] shadow-xl rounded-[20px]">
                    <View className="flex-row justify-between items-start">
                        <View className={`${session ? "bg-[#E3F5EA]" : "bg-[#F5D5E8]"} flex-row items-center ml-3 mt-6 rounded-full px-3 py-2 justify-center`}>
                            {session && (<View className="bg-[#2FAE6B] h-2.5 w-2.5 rounded-full mr-2"></View>)}
                            <Text className={`${session ? "text-[#1F7A4A]" : "text-[#cc58b5]"} text-[13px] font-inter-bold`}>{session ? "Chez son assmat" : "À la maison aujourd'hui"}</Text>
                        </View>
                        <Image source={session ? require("@/assets/images/girafe-toctoc.png") : require("@/assets/images/girafe-endormie-toctoc.png")} className="w-20 h-24 mt-2 mr-5" />
                    </View>
                    {session ? (
                        <View className="mt-5 items-center">
                            <Text className="text-[#8B8698] font-inter-semibold text-[15px]">Temps de garde aujourd'hui</Text>
                            <Text className="text-[#7C3AED] font-inter-black text-[50px] mt-2">{timeSpend}</Text>
                            <Text className="text-[#8B8698] font-inter-medium  text-[12.5px] mt-2 mb-5">
                                Arrivée chez {assmat?.prenom} à {session.start.padStart(2, "0").slice(0, 2)}h{session.start.padStart(2, "0").slice(3, 5)}
                            </Text>
                            <View className="items-center justify-between w-[88%] border-t-[1px] border-t-[#F0EBF8] px-1 flex-row mt-8 pt-6">
                                <View className="flex-row items-center">
                                    <View className="h-12 w-12 bg-[#EDE4FB] items-center justify-center rounded-full">
                                        <Text className="font-inter-black text-[#7C3AED]">{assmat.prenom.slice(0, 1).toUpperCase()}</Text>
                                    </View>
                                    <View className="ml-3">
                                        <Text className="font-inter-bold text-[13.5px]">{assmat.prenom} {assmat.nom}</Text>
                                        <Text className="font-inter-semibold text-[11px] text-ink-faint mt-0.5">Assistant(e) maternelle</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center gap-2.5">
                                    <View className="w-14 h-14 border-[1px] border-[#EFE3F3] bg-white shadow-sm rounded-full items-center justify-center">
                                        <Ionicons name="call-outline" size={17} color={"#2FAE6B"}></Ionicons>
                                    </View>
                                    <View className="w-14 h-14 border-[1px] border-[#EFE3F3] bg-white shadow-sm rounded-full items-center justify-center">
                                        <Ionicons name="chatbubbles-outline" size={17} color={"#E84B9C"}></Ionicons>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View className="mt-5 items-center">
                            <View className="w-20 h-20 bg-[#EDE4FB] rounded-full items-center justify-center">
                                <Ionicons name="home-outline" color={"#7C3AED"} size={35}></Ionicons>
                            </View>
                            <Text className="font-black text-[20px] mt-5">Une journée à la maison</Text>
                            <Text className="text-ink-faint mt-2">Prochaine garde avec {assmat.prenom}</Text>
                            <Text className="text-[#7C3AED] font-bold text-[17px] mt-3">Jeudi 4 septembre - 8h05</Text>
                            <View className="items-center justify-between w-[88%] border-t-[1px] border-t-[#F0EBF8] px-1 flex-row mt-8 pt-6">
                                <View className="flex-row items-center">
                                    <View className="h-12 w-12 bg-[#EDE4FB] items-center justify-center rounded-full">
                                        <Text className="font-black text-[#7C3AED]">{assmat.prenom.slice(0, 1).toUpperCase()}</Text>
                                    </View>
                                    <View className="ml-3">
                                        <Text className="font-bold text-[13.5px]">{assmat.prenom} {assmat.nom}</Text>
                                        <Text className="font-semibold text-[11px] text-ink-faint mt-0.5">Assistant(e) maternelle</Text>
                                    </View>
                                </View>
                                <View className="flex-row items-center gap-2.5">
                                    <View className="w-14 h-14 border-[1px] border-[#EFE3F3] bg-white shadow-sm rounded-full items-center justify-center">
                                        <Ionicons name="call-outline" size={17} color={"#2FAE6B"}></Ionicons>
                                    </View>
                                    <View className="w-14 h-14 border-[1px] border-[#EFE3F3] bg-white shadow-sm rounded-full items-center justify-center">
                                        <Ionicons name="chatbubbles-outline" size={17} color={"#E84B9C"}></Ionicons>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            </View>
            <View className="flex-row mt-15 items-center justify-between mr-3">
                <Text className=" font-inter-bold ml-6 text-[14px]">{timeSelect[timeSelectId]}</Text>
                <View className="flex-row bg-white border-ink-faint border-[0.5px] rounded-full px-2 py-1 items-center">
                    <Pressable onPress={() => setTimeSelectId(0)}><Text className={`text-[10px] font-inter-bold px-2 py-1  ${timeSelectId === 0 ? "rounded-full text-violet bg-[#EDE4FB]" : "text-ink-soft"}`}>Semaine</Text></Pressable>
                    <Pressable onPress={() => setTimeSelectId(1)}><Text className={`text-[10px] font-inter-semibold px-3 py-1  ${timeSelectId === 1 ? "rounded-full text-violet bg-[#EDE4FB]"  : "text-ink-soft"}`}>Mois</Text></Pressable>
                    <Pressable onPress={() => setTimeSelectId(2)}><Text className={`text-[10px] font-inter-semibold px-3 py-1  ${timeSelectId === 2 ? "rounded-full text-violet bg-[#EDE4FB]"  : "text-ink-soft"}`}>Année</Text></Pressable>
                    <Pressable onPress={() => setTimeSelectId(3)}><Text className={`text-[10px] font-inter-semibold px-3 py-1  ${timeSelectId === 3 ? "rounded-full text-violet bg-[#EDE4FB]"  : "text-ink-soft"}`}>Total</Text></Pressable>
                </View>
            </View>
            <View className="border-t-ink-faint border-t-1 border-b-ink-faint border-b-1 py-5 mt-3 flex-row justify-around bg-white rounded">
                <View className="flex-column items-center border-r-1 border-r-ink-faint w-1/3 py-1">
                    <Text className="font-inter-black text-[18px]">{tdg}</Text>
                    <Text className="font-inter-regular text-center text-ink-faint text-[10px]">Temps de garde</Text>
                </View>
               <View className="flex-column items-center w-1/3 py-1">
                    <Text className="font-inter-black text-[18px]">{nbrSession}</Text>
                    <Text className=" font-inter-regular text-[10px] text-center text-ink-faint">Sessions de garde</Text>
                </View>
               <View className="flex-column items-center w-1/3 border-l-1 border-ink-faint py-1">
                    <Text className="font-inter-black text-[18px]">{totalMoney} €</Text>
                    <Text className="font-inter-regular text-[10px] text-center text-ink-faint">Montant</Text>
                </View>
            </View>
            <View className="flex-row justify-between ml-6 mr-6 mt-15 items-center">
                <Text className="font-inter-bold text-[15px]">Aujourd'hui</Text>
                <Pressable>
                    <Text className="text-violet text-[12px] font-inter-semibold">Tout voir</Text>
                </Pressable>
            </View>
            <View>
                {!news ? (
                    <View className="w-full justify-center items-center mt-30">
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
                                <View className="border-l-1 border-ink-faint w-full justify-center ml-6 pb-10">
                                    <Text className="font-inter-extrabold ml-4 text-[14px]">{actu.title}</Text>
                                    <Text className="font-inter-semibold text-ink-faint text-[12px] ml-4">{actu.description}</Text>
                                    {actu.photoUrl && (<Image className=" h-30 ml-4 rounded-[10px] mt-3 w-2/3" source={{ uri: actu.photoUrl}}></Image>)}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>
        </View>
    )
}