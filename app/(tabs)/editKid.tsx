import { TopLogo } from "@/components/topLogo";
import "@/global.css";
import { fetchOneKid } from "@/lib/fetch/fetchOneKid";
import { handleDeleteKid } from "@/lib/handle/handleDeleteKid";
import { handleUpdateKid } from "@/lib/handle/handleUpdateKid";
import { supabase } from "@/lib/supabase";
import { formatDateInput } from "@/lib/utils/formatDateInput";
import { formatTelInput } from "@/lib/utils/formatTelInput";
import { pickAndUploadPicture } from "@/lib/utils/uploadPicture";
import { Child } from "@/types/enfant";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function getIdColor(color :string) {
  if (color === "#F2559C")
    return 0;
  if (color === "#7C3AED")
    return 1;
  if (color === "#C9A9E9")
    return 2;
  if (color === "#6FCF97")
    return 3;
  return 4;
}

export default function App() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [child, setChild] = useState<Child | null>(null);
  const insets = useSafeAreaInsets();
  const [newColor, setNewColor] = useState("");
  const [newColorId, setNewColorId] = useState(0);
  const [newPrenomEnfant, setNewPrenomEnfant] = useState("");
  const [newNomEnfant, setNewNomEnfant] = useState("");
  const [newDateNaissance, setNewDateNaissance] = useState("");
  const [newParentPrenom, setNewParentPrenom] = useState("");
  const [newParentNom, setNewParentNom] = useState("");
  const [newTel, setNewTel] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTaux, setNewTaux] = useState("");
  const [newIndemnite, setNewIndemnite] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newUrl, setNewUrl] = useState("");

  useEffect(() => {
    fetchOneKid(id).then(({ data, error}) => {
      setChild(data);
      if (error) {
        console.error(error);
      }
    })
  }, [id]);

  async function onPresseEdit() {
    setErrorMessage("");
    if (
      !newNomEnfant ||
      !newPrenomEnfant ||
      !newDateNaissance ||
      !newParentNom ||
      !newParentPrenom ||
      !newTel ||
      !newEmail ||
      !newTaux ||
      !newIndemnite
    ) {
      setErrorMessage("Tous les champs sont obligatoires !");
      return;
    }
    const { error } = await handleUpdateKid(
      newNomEnfant,
      newPrenomEnfant,
      newDateNaissance,
      newEmail,
      newTel,
      newParentNom,
      newParentPrenom,
      newTaux,
      newIndemnite,
      newColor,
      newUrl,
      id,
    );

    if (error) {
      setErrorMessage(error);
      return;
    }
    router.replace("/homepage");
  }

  useEffect(() => {
      if (!child) return;
      setNewColor(child.avatarColor);
      setNewColorId(getIdColor(child.avatarColor));
      setNewNomEnfant(child.lastname);
      setNewPrenomEnfant(child.firstname);
      setNewDateNaissance(child.birthDate);
      setNewParentPrenom(child.parentContactFirstname);
      setNewParentNom(child.parentContactLastname);
      setNewEmail(child.parentContactEmail);
      setNewTel(child.parentContactNumber);
      setNewTaux(child.hourlyWageRate.toLocaleString());
      setNewIndemnite(child.dailyAllowance.toLocaleString());
      setNewUrl(child.profilePictureUrl);
  }, [child]);

  function handleDateChange(text: string) {
    setNewDateNaissance(formatDateInput(text));
  }

  function handleTelChange(text: string) {
    setNewTel(formatTelInput(text));
  }

  async function onPressPickPicture() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }
    const { url, error } = await pickAndUploadPicture(user.id);
    if (error) {
      console.error(error);
      return;
    }
    if (url) {
      setNewUrl(url);
    }
  }

  if (!child) {
    return;
  }

  return (
    <ScrollView   style={{ paddingTop: insets.top }} className="flex-1 bg-white" contentContainerStyle={{ paddingHorizontal: 28, paddingBottom: 40 }}>
      <TopLogo></TopLogo>
      <View className="flex-row items-center mt-10">
        <Pressable className="bg-[#F2ECFB] shadow-lg border-1 border-ink-faint rounded-full p-3" onPress={() => router.push("/homepage")}>
           <Ionicons name="arrow-back-outline" size={20} color="#221733" />
        </Pressable>
        <Text className="ml-3 font-bold text-[35px]">Modifier {child.firstname}</Text>
      </View>
      <View className="items-center mt-15">
        <View className="relative w-30 h-30">
          {!newUrl ? (
            <View
              style={{ backgroundColor: newColor }}
              className="flex-row items-center justify-center w-30 h-30 rounded-full shadow-lg"
            >
              <Text className="font-extrabold text-white text-[33px]">
                {newPrenomEnfant.slice(0, 1).toUpperCase()}
              </Text>
            </View>
          ) : (
            <Image source={{ uri: newUrl }} className="w-30 h-30 rounded-full" />
          )}
          <Pressable
            className="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-violet border-[3px] border-white items-center justify-center shadow-lg"
          >
            <Ionicons name="camera-outline" size={14} color="#fff" onPress={onPressPickPicture} />
          </Pressable>
        </View>
        <View className="justify-center mt-5">
          <View className="flex-row gap-4">
            <Pressable className={`w-10 h-10 bg-[#F2559C] rounded-full ${newColorId === 0 ? "border-1" : ""}`} onPress={() => {setNewColor("#F2559C"); setNewColorId(0)}}/>
            <Pressable className={`w-10 h-10 bg-[#7C3AED] rounded-full ${newColorId === 1 ? "border-1" : ""}`} onPress={() => {setNewColor("#7C3AED"); setNewColorId(1)}}/>
            <Pressable className={`w-10 h-10 bg-[#C9A9E9] rounded-full ${newColorId === 2 ? "border-1" : ""}`} onPress={() => {setNewColor("#C9A9E9"); setNewColorId(2)}}/>
            <Pressable className={`w-10 h-10 bg-[#6FCF97] rounded-full ${newColorId === 3 ? "border-1" : ""}`} onPress={() => {setNewColor("#6FCF97"); setNewColorId(3)}}/>
            <Pressable className={`w-10 h-10 bg-[#F2B84B] rounded-full ${newColorId === 4 ? "border-1" : ""}`} onPress={() => {setNewColor("#F2B84B"); setNewColorId(4)}}/>
          </View>
        </View>
      </View>
      <Text className="text-violet text-[15px] font-bold mt-20">INFORMATION DE L'ENFANT</Text>
      <View className="mt-6 flex-row self-center">
        <View className="w-[40%]">
          <Text className="font-bold text-ink">Prénom</Text>
          <TextInput
            value={newPrenomEnfant}
            onChangeText={setNewPrenomEnfant}
            autoCapitalize="words"
            className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[35px]"
            placeholderTextColor="#B7A9C9"
            placeholder="Léo"
          ></TextInput>
        </View>
        <View className="w-[50%] ml-10">
          <Text className="font-bold text-ink">Nom</Text>
          <TextInput
            value={newNomEnfant}
            onChangeText={setNewNomEnfant}
            autoCapitalize="words"
            className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[35px]"
            placeholderTextColor="#B7A9C9"
            placeholder="Martin"
          ></TextInput>
        </View>
      </View>
      <View className="w-[40%] ml-6 mt-4">
        <Text className="font-bold text-ink">Date de naissance</Text>
        <TextInput
              value={newDateNaissance}
              onChangeText={handleDateChange}
              keyboardType="numbers-and-punctuation"
              className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[30px]"
              placeholderTextColor="#B7A9C9"
              placeholder="JJ / MM / AAAA"
        ></TextInput>
      </View>
      <Text className="text-violet text-[15px] font-bold mt-20">CONTACT DU PARENT</Text>
      <View className="mt-6 flex-row self-center">
        <View className="w-[40%]">
          <Text className="font-bold text-ink">Prénom</Text>
          <TextInput
            value={newParentPrenom}
            onChangeText={setNewParentPrenom}
            autoCapitalize="words"
            className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[35px]"
            placeholderTextColor="#B7A9C9"
            placeholder="Léo"
          ></TextInput>
        </View>
        <View className="w-[50%] ml-10">
          <Text className="font-bold text-ink">Nom</Text>
          <TextInput
            value={newParentNom}
            onChangeText={setNewParentNom}
            autoCapitalize="words"
            className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[35px]"
            placeholderTextColor="#B7A9C9"
            placeholder="Martin"
          ></TextInput>
        </View>
      </View>
      <View className="mt-6 flex-row self-center">
        <View className="w-[40%]">
          <Text className="font-bold text-ink">Téléphone</Text>
          <TextInput
            value={newTel}
            onChangeText={handleTelChange}
            keyboardType="phone-pad"
            autoComplete="tel"
            className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[35px]"
            placeholderTextColor="#B7A9C9"
            placeholder="06 12 34 65 27"
          ></TextInput>
        </View>
        <View className="w-[50%] ml-10">
          <Text className="font-bold text-ink">Email</Text>
          <TextInput
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[35px]"
            placeholderTextColor="#B7A9C9"
            placeholder="sophie.martin@gmail.com"
          ></TextInput>
        </View>
      </View>
      <Text className="text-violet text-[15px] font-bold mt-20">TARIFICATION</Text>
      <View className="items-center">
        <View className="mt-10 w-full flex-row bg-[#EFE4FF] rounded-2xl overflow-hidden">
          <View className="flex-1 py-5 px-5">
            <Text className="font-bold text-[11px] text-violet-deep uppercase tracking-wide">
              Taux horaire
            </Text>
            <View className="flex-row items-baseline mt-2">
              <TextInput
                className="font-extrabold text-[22px] text-ink"
                value={newTaux.toLocaleString()}
                onChangeText={setNewTaux}
                keyboardType="decimal-pad"
              />
              <Text className="ml-1 text-[12px] font-semibold text-ink-faint">€ / h</Text>
            </View>
          </View>

          <View className="w-[1.5px] bg-white/60 my-5" />

          <View className="flex-1 py-5 px-5">
            <Text className="font-bold text-[11px] text-violet-deep uppercase tracking-wide">
              Indemnité / jour
            </Text>
            <View className="flex-row items-baseline mt-2">
              <TextInput
                className="font-extrabold text-[22px] text-ink"
                value={newIndemnite.toLocaleString()}
                onChangeText={setNewIndemnite}
                keyboardType="decimal-pad"
              />
              <Text className="ml-1 text-[12px] font-semibold text-ink-faint">€</Text>
            </View>
          </View>
        </View>
      </View>
      {errorMessage && (
        <Text>
          {errorMessage}
        </Text>
      )}
      <Pressable className="px-8 h-17 rounded-[17px] shadow-lg justify-center items-center mt-8 bg-violet" onPress={() => {onPresseEdit()}}>
        <Text className="font-bold text-white text-[16px]">
          Enregistrer les modifications
        </Text>
      </Pressable>
      <Pressable className="mt-2 mb-8 w-[50%] self-center rounded-2xl border-[1.5px] border-red-500 w-full py-3 items-center" onPress={() => handleDeleteKid(child.id)}>
          <View className="flex-row items-center">
            <Ionicons name="trash-outline" color={"red"} size={17}></Ionicons>
            <Text className="text-red-500"> Retirer l'enfant</Text>
          </View>
      </Pressable>
      <View className="h-40"></View>
    </ScrollView>
  );
}
