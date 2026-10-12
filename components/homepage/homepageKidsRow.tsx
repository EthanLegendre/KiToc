import { KidInfo } from "@/components/kid/kidInfo";
import "@/global.css";
import { checkKidInSession } from "@/lib/check/checkKidInSession";
import { fetchActiveSessionKid } from "@/lib/fetch/fetchActiveSessionKid";
import { fetchAssmatKids } from "@/lib/fetch/fetchAssmatKids";
import { fetchNbrKidInSession } from "@/lib/fetch/fetchNbrKidInSession";
import { getMinuteEcoulees } from "@/lib/utils/getMinuteEcoule";
import { Child } from "@/types/enfant";
import { session } from "@/types/session";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  child: Child;
  onPress: () => void;
  refreshTriger: number;
};

function KidRow({ child, onPress, refreshTriger }: Props) {
  const [isInSession, setIsInSession] = useState(false);
  const [session, setSession] = useState<session | null>(null);
  const taux_minute = child.hourlyWageRate / 60;
  const [argent, setArgent] = useState(0);``

  useEffect(() => {
    setIsInSession(false);
    checkKidInSession(child.id).then((setIsInSession));
    fetchActiveSessionKid(child.id).then(({ data, error}) => {
      setSession(data);
      if (error) console.error(error);
    })
  }, [child.id, refreshTriger]);

    useEffect(() => {
      if (!session) {
        return;
      }
      const interval = setInterval(() => {
            setArgent(getMinuteEcoulees(session.start) * taux_minute);
        }, 1000);
        return () => clearInterval(interval);
    }, [session?.start]);

  return (
    <View className="flex-row items-center justify-between border-b-1 border-[#E5D4FF] rounded-2xl px-4 py-3 mb-4">
      <View className="flex-row items-center gap-3">
        {!child.profilePictureUrl ? (
          <View className="rounded-full border-1 border-ink-faint items-center justify-center">
              <View className="w-[50px] h-[50px] border-3 border-white rounded-full items-center justify-center" style={{ backgroundColor: child.avatarColor }}>
                <Text className="text-white font-inter-extrabold">
                  {child.firstname.charAt(0)}
                </Text>
              </View>
          </View>
        ) : (
          <View className="rounded-full border-1 border-ink-faint items-center justify-center">
            <Image source={{ uri: child.profilePictureUrl }} className="h-[50px] w-[50px] rounded-full border-2 border-white"></Image>
          </View>
        )}
        <View>
          <Text className="font-inter-bold text-[14.5px] text-ink">
            {child.firstname}
          </Text>
          {(!isInSession) ? (
            <Text className="text-ink-soft text-[12px] font-inter-regular mt-0.5">
              Prévu à 16h30
            </Text>
          ) : (
            <View className="flex-column justify-center">
              {session && (
                <Text className="text-[12px] text-[#2FAE6B] font-inter-semibold">
                    En garde depuis {session.start.slice(0, 5)}
                </Text>
              )}
              <Text className="text-[10px] font-inter-black mt-3">
                  +{(argent).toFixed(2)}<Text className="text-[7px]">€</Text>
              </Text>
              <Text className="text-[10px] font-inter-black">
                  +{(child.dailyAllowance).toFixed(2)}<Text className="text-[7px]">€</Text>
              </Text>
            </View>
          )}
        </View>
      </View>
      <Pressable
        className="w-9 h-9 rounded-full bg-violet/80 items-center justify-center"
        onPress={onPress}
      >
        <Ionicons name="chevron-forward" color="#fff" size={13} />
      </Pressable>
    </View>
  )
}

export function HomepageKidsRow() {
  const [childs, setChilds] = useState<Child[]>([]);
  const [activeChild, setActiveChild] = useState<Child | null>(null);
  const [nbrEnfantInSession, setNbrEnfantInSession] = useState(0);
  const [refreshTriger, setRefreshTriger] = useState(0);


  useEffect(() => {
    fetchAssmatKids().then(({ data, error }) => {
      if (data) {
        setChilds(data);
      }
      if (error) {
        console.error(error);
      }
    });
  }, []);

  useEffect(() => {
    fetchNbrKidInSession().then(({ count, error}) => {
      if (count) {
        setNbrEnfantInSession(count);
      }
      if (error) {
        console.error(error);
      }
    })
  }, [])

  function handleRefresh() {
    setRefreshTriger(refreshTriger + 1);
  }

  return (
    <View className="mt-15 border-[1px] border-[#E5D4FF] rounded-[20px] bg-white shadow-xl">
        <View className="mx-6 flex-row justify-between items-center mb-10">
          <View>
            <Text className="font-inter-bold text-[16px] text-ink mt-7 text-[23px]">Les enfants</Text>
            <Text className="font-inter-semibold text-ink-faint text-[13px]">La journée en un coup d'oeil</Text>
          </View>
          <Text className={`font-inter-semibold text-[10px] ${nbrEnfantInSession ? "text-[#1F7A4A]" : "text-[#cc58b5]"} rounded-full mt-7 px-4 py-2 ${nbrEnfantInSession ? "bg-[#E3F5EA]" : "bg-[#F5D5E8]"}`}><Text className={`font-inter-black text-[12px] ${nbrEnfantInSession ? "text-[#1F7A4A]" : "text-[#cc58b5]"}`}>{nbrEnfantInSession}</Text>{"  "}en garde</Text>
        </View>
      {childs.map((child) => (
        <KidRow key={child.id} child={child} onPress={() => setActiveChild(child)} refreshTriger={refreshTriger}/>
      ))}

      <Pressable
        className="mt-6 flex-row h-14 justify-center ml-6 mr-6 items-center rounded-[14px] border-[1.5px] border-ink-faint mb-4"
        style={{ borderStyle: "dashed" }}
        onPress={() => router.push("/addKid")}
      >
        <Text className="font-inter-semibold text-[15px] text-violet-deep">
          + Ajouter un enfant
        </Text>
      </Pressable>

      {activeChild && (
        <KidInfo child={activeChild} onClose={() => setActiveChild(null)} onSessionChange={handleRefresh}  />
      )}
    </View>
  );
}
