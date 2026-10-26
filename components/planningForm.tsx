import { fetchAssmatKids } from "@/lib/fetch/fetchAssmatKids";
import { handleAddToPlanning } from "@/lib/handle/handleAddToPlanning";
import { Child } from "@/types/enfant";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

type Props = {
    visible: boolean;
    date: Date;
    onPlanningChange?: () => void;
    onClose: () => void;
};

export function PlanningForm({ visible, date, onPlanningChange, onClose }: Props) {
    const [childs, setChilds] = useState<Child[]>([]);
    const [heureArrivée, setHeureArrivée] = useState<Date>(new Date())
    const [heureDepart, setHeureDepart] = useState<Date>(new Date())
    const [indexPick, setIndexPick] = useState(0);

    useEffect(() => {
        fetchAssmatKids().then(({ data, error}) => {
            if (data) {
                setChilds(data);
            }
            if (error) {
                console.error(error);
            }
        })
    })

    if (!visible) {
        return;
    }

    async function onPressAdd() {
      if (!childs[indexPick]) return;
      await handleAddToPlanning(childs[indexPick].id, heureArrivée, heureDepart, date);
      onPlanningChange?.();
      onClose();
    }

return (
  <Modal visible={true} transparent onRequestClose={onClose}>
    <Pressable style={{ backgroundColor: "rgba(0,0,0,0.5)" }} className="flex-1 items-center justify-center" onPress={onClose}>
      <Pressable onPress={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-[92%] px-5 pt-6 pb-6">
        <Text className="text-[28px] font-bold">
          {date.toLocaleDateString("fr-FR")}
        </Text>
        <Text className="font-semibold text-[15px] py-4">
          Selectionner un enfant :
        </Text>

        <View className="flex-row gap-3 flex-wrap justify-center">
          {childs.map((child, index) => (
            <Pressable key={child.id} onPress={() => setIndexPick(index)}>
              <View className={`border-1 pt-2 px-3 pb-3 rounded-[10px] items-center ${index === indexPick ? "border-violet bg-lavender-pale" : "border-ink-faint"}`}>
                {!child.profilePictureUrl ? (
                  <View className="w-[64px] h-[64px] rounded-full items-center justify-center" style={{ backgroundColor: child.avatarColor }}>
                    <Text className="text-white font-extrabold">
                      {child.firstname.charAt(0)}
                    </Text>
                  </View>
                ) : (
                  <Image source={{ uri: child.profilePictureUrl }} className="h-[64px] w-[64px] rounded-full"/>
                )}
                <Text className="mt-2 font-semibold">{child.firstname}</Text>
                <Text className="text-[12px]">{child.lastname}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View className="flex-row mt-6">
          <View className="flex-1 items-center">
            <Text className="font-bold text-[14px] mb-5">Heure d'arrivée</Text>
            <DateTimePicker
              value={heureArrivée}
              mode="time"
              is24Hour={true}
              onChange={(event, picked) => {
                if (picked) setHeureArrivée(picked);
              }}
            />
          </View>

          <View className="flex-1 items-center">
            <Text className="font-bold text-[14px] mb-5">Heure de départ</Text>
            <DateTimePicker
              value={heureDepart}
              mode="time"
              is24Hour={true}
              onChange={(event, picked) => {
                if (picked) setHeureDepart(picked);
              }}
            />
          </View>
        </View>

        <Pressable
          onPress={() => {onPressAdd()}}
          className="h-14 rounded-[17px] justify-center items-center mt-6 bg-violet"
        >
          <Text className="font-bold text-white text-[16px]">
            Ajouter au planning
          </Text>
        </Pressable>
      </Pressable>
    </Pressable>
  </Modal>
)}