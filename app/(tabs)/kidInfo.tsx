import { TopLogo } from "@/components/topLogo";
import { fetchActiveSessionKid } from "@/lib/fetch/fetchActiveSessionKid";
import { fetchKidSessions } from "@/lib/fetch/fetchKidSessions";
import { fetchOneKid } from "@/lib/fetch/fetchOneKid";
import { fetchPhotoKid } from "@/lib/fetch/fetchPhotoKid";
import { fetchSessionInfoTimeKidMonth } from "@/lib/fetch/fetchSessionInfoTimeKidMonth";
import { fetchSessionInfoTimeKidTotal } from "@/lib/fetch/fetchSessionInfoTimeKidTotal";
import { fetchSessionInfoTimeKidWeek } from "@/lib/fetch/fetchSessionInfoTimeKidWeek";
import { fetchSessionInfoTimeKidYear } from "@/lib/fetch/fetchSessionInfoTimeKidYear";
import { Child } from "@/types/enfant";
import { session } from "@/types/session";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { calculeTimeHour, calculeTimeMinute } from "@/lib/utils/calculeTimeHour"
import { SHORT_MONTH } from "@/lib/constants"

export default function App() {
  const insets = useSafeAreaInsets();
  const [child, setChild] = useState<Child | null>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isCopy, setIsCopy] = useState(false);
  const [session, setSession] = useState<session | null>(null);
  const [timeSelectId, setTimeSelectId] = useState(1);
  const timeSelect = ["Cette semaine", "Ce mois-ci", "Cette année", "Depuis le debut"];
  const [tdg, setTdg] = useState("0");
  const [nbrSession, setNbrSession] = useState("0");
  const [revenus, setRevenus] = useState("0");
  const [monthMoney, setMonthMoney] = useState("0");
  const [photoTab, setPhotoTab] = useState<string[] | null>([]);
  const [sessions, setSessions] = useState<session[] | null>(null)
  const [nbrSessionToShow, setNbrSessionToShow] = useState(5);

  async function copyToClipboard(text: string) {
    await Clipboard.setStringAsync(text);
  }

  useEffect(() => {
    setNbrSessionToShow(5);
    setIsCopy(false);
    if (!id) return;
    fetchOneKid(id).then(({ data, error }) => {
      setChild(data);
      if (error) console.error(error);
    });

  }, [id]);

  useEffect(() => {
    if (!child) return;
    setSession(null);
    fetchActiveSessionKid(child.id).then(({ data, error}) => {
      if (error) console.error(error);
      setSession(data);
    })

  }, [child])

  useEffect(() => {
    async function getInfoMonth() {
      if (!child) return;
      const {totalHour, totalSession, totalMoney} = await  fetchSessionInfoTimeKidMonth(child.id, child.hourlyWageRate, child.dailyAllowance, false);
      setTdg(totalHour)
      setNbrSession(totalSession)
      setRevenus(totalMoney)
    }
    async function getInfoWeek() {
      if (!child) return;
      const {totalHour, totalSession, totalMoney} = await  fetchSessionInfoTimeKidWeek(child.id, child.hourlyWageRate, child.dailyAllowance);
      setTdg(totalHour)
      setNbrSession(totalSession)
      setRevenus(totalMoney)
    }
    async function getInfoYear() {
      if (!child) return;
      const {totalHour, totalSession, totalMoney} = await  fetchSessionInfoTimeKidYear(child.id, child.hourlyWageRate, child.dailyAllowance);
      setTdg(totalHour)
      setNbrSession(totalSession)
      setRevenus(totalMoney)
    }
    async function getInfoTotal() {
      if (!child) return;
      const {totalHour, totalSession, totalMoney} = await  fetchSessionInfoTimeKidTotal(child.id, child.hourlyWageRate, child.dailyAllowance);
      setTdg(totalHour)
      setNbrSession(totalSession)
      setRevenus(totalMoney)
    }
    async function getMonthMoney() {
      if (!child) return;
      const {totalHour, totalSession, totalMoney} = await  fetchSessionInfoTimeKidMonth(child.id, child.hourlyWageRate, child.dailyAllowance, true);
      setMonthMoney(totalMoney)
    }
    if (timeSelectId === 1) getInfoMonth();
    if (timeSelectId === 0) getInfoWeek();
    if (timeSelectId === 2) getInfoYear();
    if (timeSelectId === 3) getInfoTotal();
    getMonthMoney();
  }, [timeSelectId, child])

  useEffect(() => {
    async function getPhotos() {
      if (!child) return;
      const {photoUrlTab, error} = await fetchPhotoKid(child.id);
      if (error) {console.error(error); return;};
      if (photoUrlTab) setPhotoTab(photoUrlTab.reverse());
        setPhotoTab(photoUrlTab);
    }
    getPhotos();
  }, [child])

  useEffect(() => {
    if (!child) return;
    fetchKidSessions(child.id).then(({ data, error}) => {
      if (error) {
        console.error(error);
        return;
      }
      if (data) {
        setSessions(data.reverse())
        return;
      }
      setSessions(data);
    })
  }, [child])

  if (!child) {
    return null;
  }

  console.log(sessions);

  return (
    <ScrollView
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 40 }}
    >
      <View className="mx-7">
        <TopLogo></TopLogo>
        <View className="flex-row items-center justify-between mt-10">
          <Pressable
            className="bg-[#ffffff] rounded-full p-4 border-1 border-[#E5D4FF]"
            onPress={() => router.push("/homepage")}
          >
            <Ionicons name="arrow-back-outline" size={15} color="#5B21B6" />
          </Pressable>
          <Pressable
            className="flex-row items-center bg-white py-2.5 px-5 rounded-[5px] border-1 border-[#E5D4FF]"
            onPress={() => {
              router.replace(`/editKid?id=${child.id}`);
            }}
          >
            <Ionicons
              name="create-outline"
              color={"#5B21B6"}
              size={17}
            ></Ionicons>
            <Text className="ml-2 text-[#5B21B6] font-inter-bold text-[15px] ">Modifier</Text>
          </Pressable>
        </View>
      </View>
      <View className="flex-column justify-center items-center py-10">
        {!child.profilePictureUrl ? (
          <View
            className="w-[150px] h-[150px] rounded-full items-center justify-center shadow-lg border-4 border-white"
            style={{ backgroundColor: child.avatarColor }}
          >
            <Text className="text-white text-[55px] font-bold">
              {child.firstname.charAt(0)}
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: child.profilePictureUrl }}
            className="h-[150px] w-[150px] rounded-full border-4 border-white shadow-lg"
          ></Image>
        )}
        <View className="flex-row gap-1 mt-3">
          <Text className="font-inter-extrabold text-[25px] mr-3">{child.firstname}</Text>
          <Text className="font-inter-extrabold text-[25px]">{child.lastname}</Text>
        </View>
        <Text className="text-ink-soft font-inter-regular mt-2">Ajouté le: {child.createdAt.slice(0, 10)}</Text>
        {session && (
          <View className="bg-[#E8F7EF] flex-row items-center justify-center mt-7 px-10 py-4 rounded-[14px] border-1 border-[#2FAE6B] mt-3">
            <View className="h-3 w-3 bg-[#2FAE6B] rounded-full mr-3"></View>
            <Text className="font-inter-bold text-[#2FAE6B]">  En garde depuis {session.start.slice(0, 5)}</Text>
          </View>
        )}

        <View className="flex-row mt-15 items-center justify-between mr-3 w-full mr-5">
          <Text className=" font-inter-bold ml-5 text-[16px]">{timeSelect[timeSelectId].toUpperCase()}</Text>
            <View className="flex-row bg-white border-ink-faint border-[0.5px] rounded-[13px] py-1 items-center">
                <Pressable onPress={() => setTimeSelectId(0)}><Text className={`text-[10px] font-inter-bold px-2 mx-1 py-3 ${timeSelectId === 0 ? "rounded-[7px] text-violet bg-[#EDE4FB]" : "text-ink-soft"}`}>Semaine</Text></Pressable>
                <Pressable onPress={() => setTimeSelectId(1)}><Text className={`text-[10px] font-inter-semibold px-3 mx-1 py-3  ${timeSelectId === 1 ? "rounded-[7px] text-violet bg-[#EDE4FB]"  : "text-ink-soft"}`}>Mois</Text></Pressable>
                <Pressable onPress={() => setTimeSelectId(2)}><Text className={`text-[10px] font-inter-semibold px-3 py-3 mx-1  ${timeSelectId === 2 ? "rounded-[7px] text-violet bg-[#EDE4FB]"  : "text-ink-soft"}`}>Année</Text></Pressable>
                <Pressable onPress={() => setTimeSelectId(3)}><Text className={`text-[10px] font-inter-semibold px-3 py-3 mx-1  ${timeSelectId === 3 ? "rounded-[7px] text-violet bg-[#EDE4FB]"  : "text-ink-soft"}`}>Total</Text></Pressable>
            </View>
        </View>


        <View className="border-t-ink-faint border-t-1 border-b-ink-faint border-b-1 py-5 mt-5 flex-row justify-around bg-white rounded">
             <View className="flex-column items-center border-r-1 border-r-ink-faint w-1/3 py-3">
                <Text className="font-inter-black text-[18px]">{tdg}</Text>
                <Text className="font-inter-regular text-center text-ink-faint text-[10px]">Temps de garde</Text>
              </View>
            <View className="flex-column items-center w-1/3 py-3">
                <Text className="font-inter-black text-[18px]">{nbrSession}</Text>
                <Text className=" font-inter-regular text-[10px] text-center text-ink-faint">Sessions de garde</Text>
            </View>
           <View className="flex-column items-center w-1/3 border-l-1 border-ink-faint py-3">
                <Text className="font-inter-black text-[18px]">{revenus} €</Text>
                <Text className="font-inter-regular text-[10px] text-center text-ink-faint">Montant</Text>
            </View>
        </View>

        <View className="w-full justify-center mr-5">
          <Text className="font-inter-bold mt-15 ml-5 text-[16px]">REVENUE CE MOIS</Text>
          <View className="mt-7 flex-row justify-between items-center">
            <Text className="text-[#2FAE6B] font-black text-[30px] ml-5">+{monthMoney.split(".")[0]}<Text className="font-semibold text-[17px]">,{monthMoney.split(".")[1]?.slice(0, 2)}€</Text></Text>
            <Text className="text-violet-deep font-inter-extrabold mr-4">{child.hourlyWageRate.toFixed(2)} €/h - {child.dailyAllowance.toFixed(2)} €/j</Text>
          </View>
        </View>

        <View className="w-full mt-7">
            <Text className="font-inter-bold mt-10 ml-2 text-[16px]">INFORMATION</Text>
        </View>
        <View className="w-full pl-5 pr-5">
          <View className="flex-column mt-10 w-full py-3 bg-[#F2ECFB] rounded-[13px] shadow-lg">
            <Text className="text-[#5B21B6] font-bold mt-2 ml-3 text-[17px]">
              Code parent
            </Text>
            <View className="flex-row justify-between mt-4 items-center">
              <Text className="tracking-[10px] font-extrabold text-[25px] ml-3">
                {child.invitationCode}
              </Text>
              <Pressable
                onPress={() => {
                  setIsCopy(true);
                  copyToClipboard(child.invitationCode);
                }}
              >
                {!isCopy ? (
                  <Ionicons
                    name="copy-outline"
                    className="bg-white mr-3 p-4 rounded-full border-1 border-[#5B21B6]"
                    size={20}
                  ></Ionicons>
                ) : (
                  <Ionicons
                    name="checkmark-outline"
                    className="bg-white mr-3 p-4 rounded-full border-1 border-[#5B21B6]"
                    size={20}
                  ></Ionicons>
                )}
              </Pressable>
            </View>
            {isCopy && (
              <Text className="text-[#] ml-[40%] text-[10px] font-bold">
                Copier !
              </Text>
            )}
          </View>
        </View>
      </View>
      <View className="mt-0">
          <Text className="font-inter-bold mt-15 ml-2 text-[16px]">CONTACT DU TUTEUR PRINCIPAL</Text>
          <View className="flex-row mt-8 items-center ml-1 mr-1 border-1 rounded-[10px] px-4 py-4 border-ink-faint">
            <View className="flex-row items-center">
              <View className={`h-15 w-15 items-center justify-center rounded-full bg-[${child.avatarColor}]`}>
                <Text className="font-black text-white">{child.parentContactFirstname.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View className="ml-1">
                <Text className="font-bold">{child.parentContactFirstname} {child.parentContactLastname}</Text>
                <Text className="font-semibold text-ink-faint mt-1">{child.parentContactNumber}</Text>
              </View>
            </View>
            <View className="ml-auto flex-row">
              <View className="w-10 h-10 border-1 border-ink-faint bg-white rounded-full items-center justify-center">
                <Ionicons name="call-outline" size={15}></Ionicons>
              </View>
              <View className="w-10 h-10 border-1 ml-4 border-ink-faint bg-white rounded-full items-center justify-center">
                <Ionicons name="chatbubbles-outline" size={15}></Ionicons>
              </View>
            </View>
          </View>
      </View>

      <Text className="font-inter-bold mt-15 ml-2 text-[16px]">GALLERIE PHOTO</Text>
      {photoTab && (
        <View className="flex-row flex-wrap mt-7">
          {photoTab.map((photoUrl, index) => (
            <Image
              key={`${photoUrl}-${index}`}
              source={{ uri: photoUrl }}
              className="w-1/3 h-1 aspect-square"
              resizeMode="cover"
            />
          ))}
        </View>
      )}


      <Text className="font-inter-bold mt-15 ml-2 text-[16px]">HISTORIQUE DE GARDE</Text>
      <View className="flex-row justify-between mt-5">
        <View className="flex-row ml-5 w-2/5 justify-between">
          <Text className="text-ink-soft font-inter-semibold text-[16px]">Date</Text>
          <Text className="text-ink-soft font-inter-semibold text-[16px]">Horaires</Text>
        </View>
        <View className="flex-row mr-5 w-1/3 justify-between">
          <Text className="text-ink-soft font-inter-semibold text-[16px]">Durée</Text>
          <Text className="text-ink-soft font-inter-semibold text-[16px]">Montant</Text>
        </View>
      </View>
      <View className="mt-4">
        {sessions ? (
          <View>
            {sessions.slice(0, nbrSessionToShow).map((session, index) => (
              <View>
                {session.status === "terminée" && (
                  <View className="bg-white border-t-1 border-ink-soft items-center py-4">
                    <View className="flex-row justify-between w-full">
                        <View className="flex-row ml-5 w-2/5 justify-between items-center">
                          <View>
                            <Text className="font-inter-bold text-[17px]">{session.date.slice(8)} {SHORT_MONTH[parseInt(session.date.split("-")[1], 10) - 1]}.</Text>
                            <Text className="font-inter-semibold text-ink-soft text-[14px] mt-1">Mer.</Text>
                          </View>
                          {(session.start && session.end) && (
                            <Text className="text-ink-soft font-inter-semibold text-[12px]">{session.start.slice(0, 5)} - {session.end.slice(0, 5)}</Text>
                          )}
                        </View>
                        <View className="flex-row mr-5 w-1/3 justify-between items-center">
                          <Text className="text-ink-soft font-inter-semibold text-[14px]">{calculeTimeHour(session.start, session.end)}</Text>
                          <Text className="font-inter-bold text-[14px]">+{((calculeTimeMinute(session.start, session.end)) * (child.hourlyWageRate / 60)).toFixed(2)}€</Text>
                        </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
            {nbrSessionToShow < (sessions?.length ?? 0)  && (
              <Pressable className="mt-3  flex-row h-14 justify-center  items-center rounded-[14px] border-[1.5px] border-ink-faint mb-4" style={{ borderStyle: "dashed" }} onPress={() => {setNbrSessionToShow(nbrSessionToShow + 5); console.log(nbrSessionToShow)}}>
                <Text className="font-inter-semibold text-[15px] text-violet-deep">
                  Voir plus
                </Text>
              </Pressable>
            )}
        </View>
        ) : (
          <View></View>
        )}
      </View>
    </ScrollView>
  );
}
