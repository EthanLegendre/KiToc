import { View, Text, Modal, Pressable, TextInput, Image } from "react-native";
import "@/global.css"
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons"
import { checkKidExist } from "@/lib/check/checkKidExist";
import { handleAddParentKid } from "@/lib/handle/handleAddParentKid";

type Props = {
    visible: boolean;
    onClose: () => void;
}

export function AddKidForm({ visible, onClose }: Props)
{
    const [invitationCode, setInvitationCode] = useState("");
    const [codePin, setCodePin] = useState("");
    const [kidFound, setKidFound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function onPressSearch() {
        setErrorMessage("");
        setLoading(true);
        const { exist } = await checkKidExist(invitationCode);

        if (!exist) {
            setErrorMessage("Code d'invitation incorrect");
            setLoading(false);
            return;
        }
        setLoading(false);
        setKidFound(true);
    }

    async function onPressJoin() {
        setErrorMessage("");
        setLoading(true);
        const { error } = await handleAddParentKid(invitationCode, codePin);
        if (error) {
            setLoading(false)
            setErrorMessage(error);
            return;
        }
        onClose();
        setKidFound(false);
        setCodePin("");
        setInvitationCode("");
        setLoading(false)
        setErrorMessage("");
    }

    if (!visible) return;

    return (
        <Modal visible={true} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={{ backgroundColor: "rgba(0,0,0,0.5)" }} className="flex-1 items-center justify-center" onPress={() => {onClose(); setErrorMessage(""); setKidFound(false); setInvitationCode(""); setCodePin(""); setLoading(false)}}>
                <View className="bg-white rounded-[20px] items-center justify-center w-2/3 flex-column justify-center items-center">
                    <View className="w-full ">
                        <Pressable className="ml-auto mr-5 mt-5" onPress={() => {onClose(); setErrorMessage(""); setKidFound(false); setLoading(false); setInvitationCode(""); setInvitationCode("")}}>
                            <Ionicons name="close-outline" size={35} color={"#7A6C8C"}></Ionicons>
                        </Pressable>
                    </View>
                    <View className="bg-[#ffc4e0] p-5 rounded-[17px]">
                        <Image source={require("@/assets/images/bb.png")} className="h-10 w-10"></Image>
                    </View>
                    <Text className="font-extrabold text-[20px] mt-5">Rejoindre un enfant</Text>
                    { !kidFound ? (
                        <View className="items-center">
                            <Text className="text-[20px] text-ink-soft text-center mt-4">Saisissez le code transmis par l'assistante maternelle.</Text>
                            <TextInput autoCapitalize="characters" value={invitationCode} onChangeText={setInvitationCode} style={{ textAlign: "center"}} className="h-20 mt-5 tracking-[7px] text-[20px]  bg-[#fafafa] border-[#dedede] border-1 w-2/4 rounded-[18px] font-black" placeholder="ABC123"></TextInput>
                            {errorMessage && (<Text className="text-red-500 mt-2">{errorMessage}</Text>)}
                            <Pressable className="bg-[#9e68fc] w-[200px] h-15 shadow-xl mb-10 mt-5 justify-center items-center rounded-[20px]"><Text className="font-bold text-white" onPress={() => onPressSearch()}>{!loading ? "Checher" : "Chargement ..."}</Text></Pressable>
                        </View>
                    ) : (
                        <View className="items-center">
                            <Text className="text-[20px] text-ink-soft text-center mt-4">Créer le code pin pour l'enfant.</Text>
                            <TextInput keyboardType="numeric" autoCapitalize="characters" value={codePin.slice(0, 4)} onChangeText={setCodePin} style={{ textAlign: "center"}} className="h-20 mt-5 tracking-[7px] text-[20px] bg-[#fafafa] border-[#dedede] border-1 w-2/4 rounded-[18px] font-black" placeholder="2435"></TextInput>
                            <Text className="text-[11px] text-ink-faint text-center mt-3 px-4">Ce code servira à démarrer et arrêter les sessions de garde. Ne l'oublie pas !</Text>
                            {errorMessage && (<Text className="text-red-500 mt-2">{errorMessage}</Text>)}
                            <Pressable className="bg-[#9e68fc] w-[200px] h-15 shadow-xl mb-10 mt-5 justify-center items-center rounded-[20px]" onPress={() => onPressJoin()}><Text className="font-bold text-white">{loading ? "Chargement ..." : "Rejoindre"}</Text></Pressable>
                        </View>

                    )
                    }
                </View>
            </Pressable>
        </Modal>
    )
}