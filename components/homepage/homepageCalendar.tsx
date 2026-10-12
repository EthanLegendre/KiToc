import { View, Text, Image } from "react-native";
import { getDateOfWeek } from "@/lib/utils/getDateWeek";
import { fetchWeekKidPlanning } from "@/lib/utils/fetchWeekKidPlanning";
import { useEffect, useState } from "react";
import { PlannedChild } from "@/types/enfant";
import { PlanningDay } from "@/types/planning";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { router } from "expo-router";

export function groupPlanningByDay(entries: PlanningDay[], week: Date[]) {
  return week.map((date) => {
    const dateStr = date.toISOString().split("T")[0];
    const enfantsCeJour = entries.filter((entry) => entry.date === dateStr);

    return {
      date,
      child: enfantsCeJour.map((entry) => ({
        ...entry.child,
        plannedStartTime: entry.plannedStartTime,
        plannedEndTime: entry.plannedEndTime
      })) as PlannedChild[],
    };
  });
}

export function HomepageCalendar() {
  const week = getDateOfWeek();
  const debut = week[0].toISOString().split("T")[0];
  const fin = week[6].toISOString().split("T")[0];
  const [weekKid, setWeekKid] = useState<PlanningDay[] | null>(null);

  useEffect(() => {
    fetchWeekKidPlanning(debut, fin).then(({ data, error }) => {
      if (data) setWeekKid(data);
      if (error) console.error(error);
    });
  }, []);

  const planningParJour = weekKid ? groupPlanningByDay(weekKid, week) : [];

  return (
    <View className="w-full bg-white mt-8 shadow-lg rounded-[10px] justify-between px-4 py-4">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-inter-bold text-[18px]">Planning</Text>
            <Text className="font-inter-semibold text-ink-faint text-[12px]">Cette semaine</Text>
          </View>
          <Pressable onPress={() => router.replace("/planning")}>
            <Ionicons name="chevron-forward-outline" size={17}></Ionicons>
          </Pressable>
        </View>
      <View className="flex-row justify-between mt-5">

        {planningParJour.map((jour, index) => {
          const nom = jour.date.toLocaleDateString("fr-FR", { weekday: "short" });
          const numero = jour.date.getDate();
          const estAujourdhui = jour.date.toDateString() === new Date().toDateString();
          return (
            <View key={index} className="items-center gap-1.5">
              <Text className={`text-[10.5px] font-inter-semibold ${estAujourdhui ? "text-violet-deep" : "text-ink-faint"}`}>
                {nom}
              </Text>
              <View className={`w-8 h-8 rounded-full items-center justify-center ${estAujourdhui ? "bg-violet/80" : ""}`}>
                <Text className={`text-[13px] font-inter-bold ${estAujourdhui ? "text-white" : "text-ink-soft"}`}>
                  {numero}
                </Text>
              </View>
              <View className="flex-column gap-1">
                {jour.child.map((child) => (
                  !child.profilePictureUrl ? (
                    <View
                      key={child.id}
                      className="w-[15px] h-[15px] rounded-full items-center justify-center"
                      style={{ backgroundColor: child.avatarColor }}
                    >
                      <Text className=" text-[9px] text-white font-inter-extrabold">
                        {child.firstname.charAt(0)}
                      </Text>
                    </View>
                  ) : (
                    <Image
                      key={child.id}
                      source={{ uri: child.profilePictureUrl }}
                      className="h-[15px] w-[15px] rounded-full"
                    />
                  )
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}