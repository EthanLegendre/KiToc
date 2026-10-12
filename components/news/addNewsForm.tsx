import "@/global.css";
import { fetchActiveSessionKid } from "@/lib/fetch/fetchActiveSessionKid";
import { handleAddNews } from "@/lib/handle/handleAddNews";
import { supabase } from "@/lib/supabase";
import { pickAndUploadPicture } from "@/lib/utils/uploadPicture";
import { uploadVoiceMessage } from "@/lib/utils/uploadVoiceMessage";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Modal, Pressable, Text, TextInput, View } from "react-native";
import { VoiceRecorder } from "./voiceRecoder";

type Props = {
    visible: boolean;
    childId: string;
    onClose: () => void;
}

export function AddNewsForm({ visible, childId, onClose }: Props) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [photoUrl, setPhotoUrl] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [typeSelect, setTypeSelect] = useState(0);

    async function onPressPickPicture() {
    const { data: { user }} = await supabase.auth.getUser();

    if (!user)
        return;
    const { url, error } = await pickAndUploadPicture(user.id);
    if (error) {
      console.error(error);
      return;
    }
    if (url) {
        setPhotoUrl(url);
    }
    }

    async function onPressVocal(uri: string) {
        const { data: { user} } = await supabase.auth.getUser();
        if (!user) return;
        const { url, error } = await uploadVoiceMessage(user.id, uri);
        if (error) {
            console.error(error);
            return;
        }
        if (url) setAudioUrl(url);
    }

    async function onPressAjouter() {
        setErrorMessage("");
        setLoading(true);
        const { data, error } = await fetchActiveSessionKid(childId);
        if (error) {
            setErrorMessage(error);
            return;
        }
        if (!data) {
            setErrorMessage("L'enfant n'est pas en garde")
            return;
        }
        const { error: errorAddNews } = await handleAddNews(title, description, photoUrl, audioUrl, typeSelect, data.id)
        if (errorAddNews) {
            setErrorMessage(errorAddNews);
            return;
        }
        onClose();
        setAudioUrl("false");
        setPhotoUrl("");
        setDescription("");
        setLoading(false)
        setErrorMessage("");
        setTitle("");
    }

    if (!visible) return;

    return (
        <Modal visible={true} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={{ backgroundColor: "rgba(20,14,30,0.6)" }} className="flex-1 items-end justify-end" onPress={() => {onClose(); setErrorMessage(""); setAudioUrl(""); setDescription(""); setPhotoUrl(""); setTitle(""); setLoading(false)}}>
                <Pressable onPress={(e) => e.stopPropagation()} className="bg-white rounded-t-[26px] w-full flex-column px-6 pt-3 pb-8">
                    <View className="w-10 h-1 bg-[#E5D4FF] rounded-full self-center mb-5" />
                    <View className="flex-row items-center justify-between w-full mb-5">
                        <Text className="font-inter-bold text-[18px] text-ink">Ajouter au récap</Text>
                        <Pressable className="w-8 h-8 rounded-full bg-lavender-pale items-center justify-center" onPress={onClose}>
                            <Ionicons name="close-outline" size={18} color="#7A6C8C" />
                        </Pressable>
                    </View>

                    <Text className="text-[11.5px] font-inter-bold text-ink-soft uppercase tracking-wide mb-1.5">Type</Text>
                    <View className="flex-row w-2/3 justify-between gap-10 mt-2">
                        <Pressable className={`${typeSelect === 0 ? "border-1 border-[#7C3AED]" : ""} bg-[#EDE4FB] rounded-[15px] p-4`} onPress={() => setTypeSelect(0)}>
                            <Ionicons name="time-outline" size={20} color={"#7C3AED"}></Ionicons>
                        </Pressable>
                        <Pressable className={`${typeSelect === 1 ? "border-1 border-[#E84B9C]" : ""} bg-[#FBEAF2] rounded-[15px] p-4`} onPress={() => setTypeSelect(1)}>
                            <Ionicons name="fast-food-outline" color={"#E84B9C"} size={20}></Ionicons>
                        </Pressable>
                        <Pressable className={`${typeSelect === 2 ? "border-1 border-[#E0A63C]" : ""} bg-[#FBF1DC] rounded-[15px] p-4`} onPress={() => setTypeSelect(2)}>
                            <Ionicons name="color-palette-outline" color={"#E0A63C"} size={20}></Ionicons>
                        </Pressable>
                        <Pressable className={`${typeSelect === 3 ? "border-1 border-[#2FAE6B]" : ""} bg-[#E3F5EA] rounded-[15px] p-4`} onPress={() => setTypeSelect(3)}>
                            <Ionicons name="bed-outline" size={20} color={"#2FAE6B"}></Ionicons>
                        </Pressable>
                    </View>

                    <Text className="text-[11.5px] font-inter-bold text-ink-soft uppercase tracking-wide mt-5 mb-1.5">Titre</Text>
                    <TextInput className="border-[1.5px] border-[#E5D4FF] w-full rounded-[14px] px-4 py-3 font-inter-semibold text-ink" value={title} onChangeText={setTitle} placeholder="Sortie au parc" placeholderTextColor="#B7A9C9"/>

                    <Text className="mt-4 text-[11.5px] font-inter-bold text-ink-soft uppercase tracking-wide mb-1.5">Description</Text>
                    <TextInput className="border-[1.5px] border-[#E5D4FF] w-full rounded-[14px] px-4 py-3 h-[90px] font-inter-semibold text-ink" value={description} onChangeText={setDescription} placeholder="Raconte ce qui s'est passé..." placeholderTextColor="#B7A9C9"multiline textAlignVertical="top"/>

                    <Text className="mt-4 text-[11.5px] font-inter-bold text-ink-soft uppercase tracking-wide mb-2">Ajouter un média (optionnel)</Text>
                    <View className="flex-row gap-2.5">
                        <Pressable className={`${photoUrl ? "bg-lavender-pale shadow-lg" : "py-5"} flex-1 items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-violet`} onPress={() => onPressPickPicture()}>
                            {photoUrl ? (
                                <Image source={{ uri: photoUrl }} className="w-full h-30 rounded-[12px]" resizeMode="cover" />
                            ) : (
                                <View>
                                    <View className="w-9 h-9 rounded-full bg-violet items-center justify-center">
                                        <Ionicons name="camera-outline" size={16} color="#fff" />
                                    </View>
                                    <Text className="text-[12px] font-inter-bold text-ink">Photo</Text>
                                </View>
                            )}
                        </Pressable>
                        <VoiceRecorder onRecorded={onPressVocal} />
                    </View>

                    <Pressable className="w-full rounded-[16px] mt-6 py-3.5 bg-violet justify-center items-center" onPress={() => onPressAjouter()}>
                        <Text className="text-white font-inter-bold text-[14.5px]">{loading ? "Chargement..." : "Ajouter"}</Text>
                    </Pressable>
                </Pressable>
            </Pressable>
        </Modal>
    )
}