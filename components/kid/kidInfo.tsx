import { checkKidInSession } from "@/lib/check/checkKidInSession";
import { handleDeleteKid } from "@/lib/handle/handleDeleteKid";
import { handleCreateSession } from "@/lib/handle/handleCreateSession";
import { Child } from "@/types/enfant";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View, TextInput } from "react-native";
import { AddNewsForm } from "../news/addNewsForm";
import { checkKidHaveTutor } from "@/lib/check/checkKidHaveTutor";

type Props = {
  child: Child;
  onClose: () => void;
  onSessionChange?: () => void;
};

export function KidInfo({ child, onClose, onSessionChange }: Props) {
  const [isInSession, setIsInSession] = useState(false);
  const [showAddNewsForm, setShowAddNewsForm] = useState(false);
  const [askPinCode, setAskPinCode] = useState(false);
  const [codePin, setCodePin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [haveTutor, setHaveTutor] = useState(false);

  async function manageSession() {
    setLoading(true);
    setErrorMessage("");
    checkKidInSession(child.id).then((setIsInSession));
    console.log(isInSession);
    const { error } = await handleCreateSession(child?.id, isInSession, codePin);
    if (error) {
      setLoading(false);
      setErrorMessage(error);
      return;
    }
    checkKidInSession(child.id).then((setIsInSession));
    onSessionChange?.();
    setAskPinCode(false);
    setLoading(false);
    onClose();
  }

  useEffect(() => {
    checkKidInSession(child.id).then((setIsInSession));
    checkKidHaveTutor(child.id).then(({ error, haveTutor}) => {
      if (error){
        console.error(error);
        return;
      }
      setHaveTutor(haveTutor);
    })
  }, [child.id]);

  return (
    <Modal
      visible={!!child}
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        className="flex-1 items-center justify-center"
        onPress={onClose}
      >
        {child && (
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 mx-8 w-[85%]"
          >
            <View className="flex-row border-b-[1px] py-5 border-b-[#EFE3F3]">
              <View
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{ backgroundColor: child.avatarColor }}
              >
                <Text className="text-white font-extrabold">
                  {child.lastname.charAt(0)}
                </Text>
              </View>
              <View className="ml-3">
                <Text className="font-bold text-[14.5px] text-ink">
                  {child.firstname}
                </Text>
                <Text className="text-ink-soft text-[12px] font-medium mt-0.5">
                  {child.parentContactEmail}
                </Text>
              </View>
            </View>
            {!isInSession ? (
              <Pressable
                className="flex-row items-center mt-10"
                onPress={() => {if (haveTutor) setAskPinCode(true)}}
              >
                <View className={`${haveTutor ? "bg-[#D6E4FA]" : "bg-[#dcddde]"} rounded-[7px] p-3`}>
                  {haveTutor ? (<Ionicons name="play" color={"#3B6FD6"} size={16} />) : (<Ionicons name="lock-closed"  size={16} />)}
                </View>
                <View className="flex-col ml-4">
                  <Text className="font-bold text-[15px]">
                    Lancer une session
                  </Text>
                  {haveTutor ? (<Text className="text-ink-soft text-[12px] mt-1">Nécessite le code du parent</Text>) : (<View className="flex-row items-center"><Ionicons name="alert-circle-outline" color={"red"}/><Text className="text-red-400 ml-1 text-[9px] mt-1 font-inter-semibold">Aucun tuteur lié à l'enfant</Text></View>)}
                </View>
              </Pressable>
            ) : (
              <Pressable
                className="flex-row items-center mt-10"
                onPress={() => setAskPinCode(true)}
              >
                <View className="bg-[#fa8f87] rounded-[7px] p-3">
                  <Ionicons name="stop" color={"white"} size={16} />
                </View>
                <View className="flex-col ml-4">
                  <Text className="font-bold text-[15px]">
                    Arrêter la session
                  </Text>
                  <Text className="text-ink-soft text-[12px] mt-1">
                    Nécessite le code du parent
                  </Text>
                </View>
              </Pressable>
            )}
            <Pressable
              className="flex-row items-center mt-10"
              onPress={() => {
                onClose();
                router.push(`/kidInfo?id=${child.id}`);
              }}
            >
              <View className="bg-[#F2ECFB] rounded-[7px] p-3">
                <Ionicons
                  name="newspaper-outline"
                  size={15}
                  color={"#5B21B6"}
                />
              </View>
              <View className="flex-col ml-4">
                <Text className="font-bold text-[15px]">Voir la fiche</Text>
                <Text className="text-ink-soft text-[12px] mt-1">
                  Infos, parents, historique
                </Text>
              </View>
            </Pressable>
            <Pressable className="flex-row items-center mt-10" onPress={() => setShowAddNewsForm(true)}>
              <View className="bg-[#E8F7EF] rounded-[7px] p-3">
                <Ionicons name="cube-outline" size={16} color={"#2FAE6B"} />
              </View>
              <View className="flex-col ml-4">
                <Text className="font-bold text-[15px]">Ajouter au récap</Text>
                <Text className="text-ink-soft text-[12px] mt-1">
                  Text, vocal ou photo
                </Text>
              </View>
            </Pressable>
            <Pressable className="flex-row items-center mt-10 border-b-[1px] pb-6 border-b-[#EFE3F3]" onPress={() => {router.replace(`/editKid?id=${child.id}`); onClose()}}>
              <View className="bg-[#EFE3F3] rounded-[7px] p-3">
                <Ionicons name="create-outline" size={16} color={"#424242"} />
              </View>
              <View className="flex-col ml-4">
                <Text className="font-bold text-[15px]">
                  Modifier les infos
                </Text>
              </View>
            </Pressable>
            <Pressable
              className="flex-row items-center mt-10"
              onPress={() => {
                onClose();
                handleDeleteKid(child.id);
              }}
            >
              <View className="bg-red-100 rounded-[7px] p-3">
                <Ionicons name="trash-outline" size={18} color={"red"} />
              </View>
              <View className="flex-col ml-4">
                <Text className="font-bold text-[15px] text-red-500">
                  Retirer l'enfant
                </Text>
              </View>
            </Pressable>
            <Pressable
              className="flex-row w-full bg-[#EFE3F3] rounded-[10px] h-11 mt-8 justify-center items-center"
              onPress={onClose}
            >
              <Text className="text-[#424242] font-bold text-[13px]">
                Annuler
              </Text>
            </Pressable>
          </Pressable>
        )}
      </Pressable>
      {showAddNewsForm && (
        <AddNewsForm visible={showAddNewsForm} childId={child.id} onClose={() => setShowAddNewsForm(false)}></AddNewsForm>
      )}
      {askPinCode && (
        <Modal visible={!!child} transparent animationType="fade" onRequestClose={onClose}>
          <Pressable style={{ backgroundColor: "rgba(0,0,0,0.5)" }} className="flex-1 items-center justify-center" onPress={onClose}>
            <View className="items-center bg-white rounded-[20px] px-5">
              <Text className="font-inter-bold text-[25px] mt-5">Code pin</Text>
              <Text className="text-ink-faint font-inter-semibold">Entrez le code pin assigné pour l'enfant</Text>
              <Ionicons className="mt-2" name="lock-closed" size={20}></Ionicons>
              <TextInput keyboardType="numeric" secureTextEntry={true} autoCapitalize="characters" value={codePin.slice(0, 4)} onChangeText={setCodePin} style={{ textAlign: "center"}} className="h-20 mt-8 tracking-[20px] text-[25px] bg-[#fafafa] border-[#dedede] border-1 w-2/4 rounded-[18px] font-inter-bold" placeholder="2435"></TextInput>
              {errorMessage && (<Text className="text-red-500 font-inter-semibold">{errorMessage}</Text>)}
              <Pressable className="bg-[#9e68fc] w-[200px] h-15 shadow-xl mb-10 mt-5 justify-center items-center rounded-[20px]" onPress={() => manageSession()}><Text className="font-bold text-white">{loading ? "Chargement ..." : "Valider"}</Text></Pressable>
            </View>
        </Pressable>
      </Modal>
      )}
    </Modal>
  );
}
