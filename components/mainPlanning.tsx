import { View, Text, Pressable, Modal } from "react-native";
import { getDateOfWeek } from "@/lib/utils/getDateWeek";
import { fetchWeekKidPlanning } from "@/lib/utils/fetchWeekKidPlanning";
import { useEffect, useState } from "react";
import { groupPlanningByDay } from "./homepage/homepageCalendar";
import "@/global.css";
import { Ionicons } from "@expo/vector-icons";
import { PlanningForm } from "./planningForm";
import { PlanningDay } from "@/types/planning";
import { format } from "date-fns";
import { handlePasteWeekPlanning } from "@/lib/handle/handlePasteWeekPlanning";
import { handleDeleteWeekPlanning } from "@/lib/handle/handleDeleteWeekPlanning";
import { PlannedChild } from "@/types/enfant";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
    plannedChild: PlannedChild;
    onClose: () => void;
}

export function PlannignFormChoice({ plannedChild, onClose }: Props) {
  const [isDeleting, setIdDeleting] = useState(false);
  const [dayCopied, setDayCopied] = useState(false);
  const [dayPaste, setDayPaste] = useState(false);
  const [newtStartTime, setNewStratTime] = useState<Date>( new Date());
  const [newEndTime, setNewEndTime] = useState<Date>(new Date());

  if (!plannedChild.plannedEndTime || !plannedChild.plannedStartTime) return;

  return (
    <Modal visible={true} transparent animationType="fade">
      <Pressable style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(20,14,30,0.6)" }} onPress={() => { onClose() }}>
          <Pressable onPress={(e) => e.stopPropagation()} className="bg-white rounded-t-[26px] w-full flex-column px-6 pt-3 pb-8">
          <View>
            <View className="w-full flex-row justify-between">
              <Ionicons className="border-1 border-red-500 p-2 rounded-[4px] ml-4" name={isDeleting ? "checkmark-outline" : "trash-outline"} color={"red"} size={20} />
                <View className="w-2/3 py-1 mt-1 justify-between rounded pr-1" style={{ backgroundColor: plannedChild.avatarColor }} >
                  <Text className="ml-1 font-inter-semibold text-white text-[11px]">{plannedChild.firstname} {plannedChild.lastname}</Text>
                  <Text className="ml-1 font-inter-semibold text-white">{plannedChild.plannedStartTime?.slice(0, 5)} - {plannedChild.plannedEndTime?.slice(0, 5)}</Text>
                </View>
              <Ionicons className="border-1 border-ink-faint p-2 rounded-[4px] mr-4" name={dayCopied ? "checkmark-outline" : "copy-outline"} size={20} />
            </View>
            <View className="flex-row justify-around mt-10">
              <DateTimePicker value={newtStartTime} mode="time" is24Hour={true} onChange={(event, picked) => {if (picked) setNewStratTime(picked);}}/>
              <DateTimePicker value={newEndTime} mode="time" is24Hour={true} onChange={(event, picked) => {if (picked) setNewEndTime(picked);}}/>
            </View>
            <View className="justify-center w-full flex-row mt-5">
              <Pressable className="bg-violet w-4/5 py-3 rounded-[10px] justify-center items-center"><Text className="text-white font-inter-bold text-[15px]">Enregistrer</Text></Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

export function MainPlanning() {
  const [referenceDate, setReferenceDate] = useState(new Date());
  const week = getDateOfWeek(referenceDate);
  const debut = format(week[0], "yyyy-MM-dd");
  const fin = format(week[6], "yyyy-MM-dd");

  const [weekKid, setWeekKid] = useState<PlanningDay[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [dateForm, setDateForm] = useState<Date>(new Date());
  const [refresh, setRefresh] = useState(0);
  const [copiedWeek, setCopiedWeek] = useState<{ start: string; end: string } | null>(null);
  const [pasting, setPasting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSingleForm, setShowSingleForm] = useState(false);
  const [plannedChild, setPlannedChild] = useState<PlannedChild | null>(null);

  useEffect(() => {
    setWeekKid(null);
    fetchWeekKidPlanning(debut, fin).then(({ data, error }) => {
      setWeekKid(data ?? []);
      if (error) console.error(error);
    });
  }, [debut, fin, refresh]);

  function changerSemaine(jours: number) {
    setIsDeleting(false);
    const newDate = new Date(referenceDate);
    newDate.setDate(referenceDate.getDate() + jours);
    setReferenceDate(newDate);
  }

  function handleRefresh() {
    setRefresh((r) => r + 1);
  }

  async function handlePaste() {
    if (!copiedWeek) return;
    setPasting(true);
    const { error } = await handlePasteWeekPlanning(copiedWeek.start, copiedWeek.end, debut, fin);
    setPasting(false);
    if (error) console.error(error);
    handleRefresh();
  }

  async function handleDeleteWeek() {
    await handleDeleteWeekPlanning(debut, fin);
    handleRefresh();
  }

  const aDesEnfants = (weekKid?.length ?? 0) > 0;
  const semaineCopiee = copiedWeek?.start === debut;
  const planningParJour = weekKid ? groupPlanningByDay(weekKid, week) : [];

  console.log((plannedChild && showSingleForm) == true)
  return (
    <View className="w-full mt-8 border-l-[1px] border-[#E5D4FF] flex-column items-center">
      <View className="flex-row items-center py-3 px-5 bg-violet rounded-[10px] mb-5">
        <Pressable className="h-[40px] w-[40px] bg-white rounded-full flex-row items-center justify-center mr-7" onPress={() => changerSemaine(-7)}>
          <Ionicons name="arrow-back-outline" size={20} />
        </Pressable>
        <Text className="text-white font-inter-bold text-[20px] mx-5">
          {week[0].getDate()} - {week[6].getDate()} {week[6].toLocaleDateString("fr-FR", { month: "long" })}
        </Text>
        <Pressable className="h-[40px] w-[40px] bg-white rounded-full flex-row items-center justify-center ml-7" onPress={() => changerSemaine(7)}>
          <Ionicons name="arrow-forward-outline" size={20} />
        </Pressable>
      </View>

      <View className="w-full mb-5 flex-row">
        <Pressable className="flex-row p-2 rounded-[5px] bg-white border-red-500 border-1 ml-6" onPress={() => {setIsDeleting(true); handleDeleteWeek()}}>
            <Ionicons name={isDeleting ? "checkmark-outline" : "trash-outline"} color={"red"} size={20} />
        </Pressable> 
        {weekKid === null ? null : aDesEnfants ? (
          <Pressable className="flex-row p-2 ml-auto rounded-[5px] bg-white border-ink-faint border-1 mr-6" onPress={() => setCopiedWeek({ start: debut, end: fin })}>
            <Ionicons name={semaineCopiee ? "checkmark-outline" : "copy-outline"} size={20} />
          </Pressable>
        ) : copiedWeek && (
          <Pressable className="flex-row p-2 ml-auto rounded-[5px] bg-white border-ink-faint border-1 mr-6" onPress={handlePaste} disabled={pasting}>
            <Ionicons name={pasting ? "hourglass-outline" : "clipboard-outline"} size={20} />
          </Pressable>
        )}
      </View>

      <View className="flex-row flex-wrap">
        {planningParJour.map((jour, index) => {
          const nom = jour.date.toLocaleDateString("fr-FR", { weekday: "long" });
          const nomAffiche = nom.charAt(0).toUpperCase() + nom.slice(1);
          const estAujourdhui = jour.date.toDateString() === new Date().toDateString();

          return (
            <View key={index} className={`w-1/2 border-r-[1px] border-b-[1px] border-[#E5D4FF] px-4 py-5 ${estAujourdhui ? "bg-lavender-pale" : "bg-white"}`}>
              <Pressable className="min-h-60" onPress={() => { setShowForm(true); setDateForm(jour.date); }}>
                <View className="flex-row items-center justify-between mb-3">
                  <Text className={`text-[12px] font-bold uppercase tracking-wide ${estAujourdhui ? "text-violet-deep" : "text-ink-faint"}`}>
                    {nomAffiche}
                  </Text>
                  {estAujourdhui && <View className="w-1.5 h-1.5 rounded-full bg-violet" />}
                </View>

                <Text className={`text-[26px] font-extrabold ${estAujourdhui ? "text-violet-deep" : "text-ink"}`}>
                  {jour.date.getDate()}
                </Text>

                {jour.child.map((child, i) => (
                  <Pressable key={i} className="w-full py-1 mt-1 justify-between rounded pr-1" style={{ backgroundColor: child.avatarColor }} onPress={() => {setPlannedChild(child); setShowSingleForm(true)}} >
                    <Text className="ml-1 font-inter-semibold text-white text-[11px]">{child.firstname} {child.lastname}</Text>
                    <Text className="ml-1 font-inter-semibold text-white">{child.plannedStartTime?.slice(0, 5)} - {child.plannedEndTime?.slice(0, 5)}</Text>
                  </Pressable>
                ))}

                {jour.child.length === 0 && (
                  <View className="w-full flex-column items-center justify-center">
                    <View className="border-ink-faint border-1 justify-center items-center rounded-full w-10 h-10" style={{ borderStyle: "dashed" }}>
                      <Text className="text-ink-faint">+</Text>
                    </View>
                    <Text className="text-ink-faint font-semibold text-[10px] mt-2 pb-15">Rien de prévu</Text>
                  </View>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>

      <PlanningForm visible={showForm} date={dateForm} onPlanningChange={handleRefresh} onClose={() => setShowForm(false)} />
      <View className="h-100" />
      {(showSingleForm && plannedChild) && (
        <PlannignFormChoice plannedChild={plannedChild}  onClose={() => {setShowSingleForm(false);}} ></PlannignFormChoice>
      )}
    </View>
  );
}