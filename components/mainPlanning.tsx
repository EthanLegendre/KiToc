import { View, Text, Pressable } from "react-native";
import { getDateOfWeek } from "@/lib/utils/getDateWeek";
import { fetchWeekKidPlanning } from "@/lib/utils/fetchWeekKidPlanning";
import { useEffect, useState } from "react";
import { groupPlanningByDay } from "./homepage/homepageCalendar";
import "@/global.css"
import { Ionicons } from "@expo/vector-icons";
import { PlanningForm } from "./planningForm";
import { PlanningDay } from "@/types/planning";

export function MainPlanning() {
    const [referenceDate, setReferenceDate] = useState(new Date());
    const week = getDateOfWeek(referenceDate);
    const debut = week[0].toISOString().split("T")[0];
    const fin = week[6].toISOString().split("T")[0];
    const [weekKid, setWeekKid] = useState<PlanningDay[] | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [dateForm, setDateForm] = useState<Date>(new Date());
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        fetchWeekKidPlanning(debut, fin).then(({ data, error }) => {
        if (data) setWeekKid(data);
        if (error) console.error(error);
        });
    }, [debut, fin]);

    function semainePrecedente() {
        const newDate = new Date(referenceDate);
        newDate.setDate(referenceDate.getDate() - 7);
        setReferenceDate(newDate);
    }

    function semaineSuivante() {
        const newDate = new Date(referenceDate);
        newDate.setDate(referenceDate.getDate() + 7);
        setReferenceDate(newDate);
    }

    function handleRefresh() {
      setRefresh(refresh + 1);
    }

    useEffect(() => {
        fetchWeekKidPlanning(debut, fin).then(({ data, error }) => {
        if (data) setWeekKid(data);
        if (error) console.error(error);
        });
    }, [refresh]);

  useEffect(() => {
    fetchWeekKidPlanning(debut, fin).then(({ data, error }) => {
      if (data) setWeekKid(data);
      if (error) console.error(error);
    });
  }, [refresh]);

  const planningParJour = weekKid ? groupPlanningByDay(weekKid, week) : [];

  return (
    <View className="w-full mt-8 border-l-[1px] border-[#E5D4FF] flex-column items-center">
        <View className="flex-row items-center py-3 px-5 bg-violet rounded-[10px] mb-10">
            <Pressable className="h-[40px] w-[40px] bg-white rounded-full flex-row items-center justify-center mr-7" onPress={() => semainePrecedente()}>
                <Ionicons name="arrow-back-outline" size={20}></Ionicons>
            </Pressable>
            <Text className="text-white font-inter-bold text-[20px] mx-5">
                {week[0].getDate()} - {week[6].getDate()} {week[6].toLocaleDateString("fr-FR", { month: "long"})}
            </Text>
            <Pressable className="h-[40px] w-[40px] bg-white rounded-full flex-row items-center justify-center ml-7" onPress={() => semaineSuivante()}>
                <Ionicons name="arrow-forward-outline" size={20}></Ionicons>
            </Pressable>
        </View>
      <View className="flex-row flex-wrap">
        {planningParJour.map((jour, index) => {
          const nom = jour.date.toLocaleDateString("fr-FR", { weekday: "long" });
          const nomAffiche = nom.charAt(0).toUpperCase() + nom.slice(1);
          const numero = jour.date.getDate();
          const estAujourdhui = jour.date.toDateString() === new Date().toDateString();

          return (
            <View key={index} className={`w-1/2 border-r-[1px] border-b-[1px] border-[#E5D4FF] px-4 py-5 ${estAujourdhui ? "bg-lavender-pale" : "bg-white"}`}>
                <Pressable className="min-h-60" onPress={() => {setShowForm(true); setDateForm(jour.date)}}>
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className={`text-[12px] font-bold uppercase tracking-wide ${estAujourdhui ? "text-violet-deep" : "text-ink-faint"}`}>
                        {nomAffiche}
                        </Text>
                        {estAujourdhui && (
                          <View className="w-1.5 h-1.5 rounded-full bg-violet" />
                        )}
                    </View>

                    <Text
                        className={`text-[26px] font-extrabold ${
                        estAujourdhui ? "text-violet-deep" : "text-ink"
                        }`}
                    >
                        {numero}
                    </Text>
                    {jour.child.map((child, index) => (
                        <View key={index}>
                            <View className={`w-full py-1 mt-1 justify-between rounded pr-1 bg-[${child.avatarColor}] `}>
                                <Text className=" ml-1 font-inter-semibold text-white text-[11px]">{child.firstname} {child.lastname}</Text>
                                <Text className=" ml-1 font-inter-semibold text-white">{child.plannedStartTime?.slice(0, 5)} - {child.plannedEndTime?.slice(0, 5)}</Text>
                            </View>
                        </View>
                    ))}
                    {jour.child.length === 0 && (
                        <View className="w-full flex-column items-center justify-center">
                            <View className="border-ink-faint border-1 justify-center items-center rounded-full w-10 h-10" style={{ borderStyle: "dashed" }}>
                                <Text className="text-ink-faint">+</Text>
                            </View>
                            <Text className="text-ink-faint font-semibold text-[10px] mt-2 pb-15">Rien de prévue</Text>
                    </View>
                    )}
                </Pressable>
            </View>
          );
        })}
      </View>
      <PlanningForm visible={showForm} date={dateForm} onPlanningChange={handleRefresh} onClose={() => setShowForm(false)} />
        <View className="h-100">
        </View>
    </View>
  );
}