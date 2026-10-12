import "@/global.css";
import { handleAddKid } from "@/lib/handle/handleAddKid";
import { supabase } from "@/lib/supabase";
import { pickAndUploadPicture } from "@/lib/utils/uploadPicture";
import { formatDateInput } from "@/lib/utils/formatDateInput";
import { formatTelInput } from "@/lib/utils/formatTelInput";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

export function AddKidForm() {
  const [color, setColor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nomEnfant, setNomEnfant] = useState("");
  const [prenomEnfant, setPrenomEnfant] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [nomParent, setNomParent] = useState("");
  const [prenomParent, setPrenomParent] = useState("");
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [avatarColor, setAvatarColor] = useState("#F2559C");
  const [urlPhoto, setUrlPhoto] = useState("");
  const [tauxHoraire, setTauxHoraire] = useState("");
  const [indemniteJournaliere, setIndemniteJournaliere] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      setUrlPhoto(url);
    }
  }

  async function onPressAddKid() {
    setErrorMessage("");
    if (
      !nomEnfant ||
      !prenomEnfant ||
      !dateNaissance ||
      !nomParent ||
      !prenomParent ||
      !tel ||
      !email ||
      !tauxHoraire ||
      !indemniteJournaliere
    ) {
      setErrorMessage("Tous les champs sont obligatoires !");
      return;
    }
    const { error } = await handleAddKid(
      nomEnfant,
      prenomEnfant,
      dateNaissance,
      email,
      tel,
      nomParent,
      prenomParent,
      tauxHoraire,
      indemniteJournaliere,
      avatarColor,
      urlPhoto,
    );

    if (error) {
      setErrorMessage(error);
      return;
    }
    router.replace("/homepage");
  }

  function handleDateChange(text: string) {
    setDateNaissance(formatDateInput(text));
  }

  function handleTelChange(text: string) {
    setTel(formatTelInput(text));
  }

  return (
    <View className="flex-column">
      <View className="w-full flex-col justify-center items-center mt-10">
        <View className="relative">
          {!urlPhoto ? (
            <View className="bg-[#F2ECFB] rounded-full p-8 shadow-lg">
              <Ionicons name="person-outline" size={25} color="#5B21B6" />
            </View>
          ) : (
            <Image
              source={{ uri: urlPhoto }}
              className="w-[78px] h-[78px] rounded-full"
            ></Image>
          )}
          <Pressable
            className="absolute right-0 bottom-0 w-8 h-8 rounded-full bg-violet border-[3px] border-white items-center justify-center shadow-lg"
            onPress={() => {
              onPressPickPicture();
              setUrlPhoto("");
            }}
          >
            <Ionicons name="camera-outline" size={14} color="#fff" />
          </Pressable>
        </View>
      </View>
      <View className="w-100% flex-row justify-center mt-6">
        <Text className="font-semibold text-[#7A6C8C]">
          Ajouter une photo (facultatif)
        </Text>
      </View>
      <View className="flex-row justify-center gap-3 mt-6">
        <Pressable
          className={`w-8 h-8 rounded-full bg-[#F2559C] border-2 ${color === 0 ? "border-ink" : "border-transparent"}`}
          onPress={() => {
            setColor(0);
            setAvatarColor("#F2559C");
          }}
        />
        <Pressable
          className={`w-8 h-8 rounded-full bg-[#7C3AED] border-2 ${color === 1 ? "border-ink" : "border-transparent"}`}
          onPress={() => {
            setColor(1);
            setAvatarColor("#7C3AED");
          }}
        />
        <Pressable
          className={`w-8 h-8 rounded-full bg-[#C9A9E9] border-2 ${color === 2 ? "border-ink" : "border-transparent"}`}
          onPress={() => {
            setColor(2);
            setAvatarColor("#C9A9E9");
          }}
        />
        <Pressable
          className={`w-8 h-8 rounded-full bg-[#6FCF97] border-2 ${color === 3 ? "border-ink" : "border-transparent"}`}
          onPress={() => {
            setColor(3);
            setAvatarColor("#6FCF97");
          }}
        />
        <Pressable
          className={`w-8 h-8 rounded-full bg-[#F2B84B] border-2 ${color === 4 ? "border-ink" : "border-transparent"}`}
          onPress={() => {
            setColor(4);
            setAvatarColor("#F2B84B");
          }}
        />
      </View>
      <Text className="mt-9 text-[17px] font-bold text-[#5B21B6]">
        Information de l'enfant
      </Text>
      <View className="mt-6 flex-row self-center">
        <View className="w-[40%]">
          <Text className="font-bold text-ink">Prénom</Text>
          <TextInput
            value={prenomEnfant}
            onChangeText={setPrenomEnfant}
            autoCapitalize="words"
            className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[35px]"
            placeholderTextColor="#B7A9C9"
            placeholder="Léo"
          ></TextInput>
        </View>
        <View className="w-[50%] ml-10">
          <Text className="font-bold text-ink">Nom</Text>
          <TextInput
            value={nomEnfant}
            onChangeText={setNomEnfant}
            autoCapitalize="words"
            className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[35px]"
            placeholderTextColor="#B7A9C9"
            placeholder="Martin"
          ></TextInput>
        </View>
      </View>
      <View className="w-full mt-1">
        <Text className="font-bold text-ink">Date de naissance</Text>
        <TextInput
          value={dateNaissance}
          onChangeText={handleDateChange}
          keyboardType="numbers-and-punctuation"
          className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[30px]"
          placeholderTextColor="#B7A9C9"
          placeholder="JJ / MM / AAAA"
        ></TextInput>
      </View>
      <Text className="mt-9 text-[17px] font-bold text-[#5B21B6]">
        Contact du parent
      </Text>
      <View className="mt-6 flex-row self-center">
        <View className="w-[40%]">
          <Text className="font-bold text-ink">Prénom</Text>
          <TextInput
            value={prenomParent}
            onChangeText={setPrenomParent}
            autoCapitalize="words"
            className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[35px]"
            placeholderTextColor="#B7A9C9"
            placeholder="Sophie"
          ></TextInput>
        </View>
        <View className="w-[50%] ml-10">
          <Text className="font-bold text-ink">Nom</Text>
          <TextInput
            value={nomParent}
            onChangeText={setNomParent}
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
            value={tel}
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
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[35px]"
            placeholderTextColor="#B7A9C9"
            placeholder="sophie.martin@gmail.com"
          ></TextInput>
        </View>
      </View>
      <Text className="mt-9 text-[17px] font-bold text-[#5B21B6]">
        Information du contrat
      </Text>
      <View className="w-full mt-6">
        <Text className="font-bold text-ink">
          Taux de rémunération horaire brut (euros)
        </Text>
        <TextInput
          value={tauxHoraire}
          onChangeText={setTauxHoraire}
          keyboardType="numbers-and-punctuation"
          className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[30px]"
          placeholderTextColor="#B7A9C9"
          placeholder="0.00€"
        ></TextInput>
      </View>
      <View className="w-full mt-6">
        <Text className="font-bold text-ink">
          Indemnité Journalière (euros)
        </Text>
        <TextInput
          value={indemniteJournaliere}
          onChangeText={setIndemniteJournaliere}
          keyboardType="numbers-and-punctuation"
          className="mt-2 mb-5 border-b-[1px] border-[#B7A9C9] h-[30px]"
          placeholderTextColor="#B7A9C9"
          placeholder="0.00€"
        ></TextInput>
      </View>
      {errorMessage && (
        <Text className="text-red-500 text-xs font-bold mt-2">
          {errorMessage}
        </Text>
      )}
      <View className="flex-row bg-[#FFDDEF] mt-5 h-25 items-center px-4 py-4 rounded-[10px]">
        <Ionicons
          name="alert-circle-outline"
          color={"#D63384"}
          size={20}
        ></Ionicons>
        <Text className="font-medium text-[#D63384] text-[15px] ml-5 mr-4">
          Un code d'invitation sera généré pour cet enfant. Vous pourrez le
          retrouver sur sa fiche.
        </Text>
      </View>
      <Pressable
        className="px-8 h-15 rounded-[17px] shadow-lg justify-center items-center mt-8 bg-violet"
        onPress={() => {
          setLoading(true);
          onPressAddKid();
        }}
      >
        <Text className="font-bold text-white text-[16px]">
          {!loading ? "Ajouter l'enfant" : "chargement ..."}
        </Text>
      </Pressable>
    </View>
  );
}
