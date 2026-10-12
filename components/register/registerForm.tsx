import "@/global.css"
import { Pressable, View, Text, TextInput } from "react-native"
import Checkbox from 'expo-checkbox'
import { useState } from "react";
import { handleSignUp } from "@/lib/handle/handleSignUp";
import { router } from "expo-router";

export function RegisterForm() {
    const [checked, setcheck] = useState(false);
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [role, setRole] = useState<"assmat" | "parent">("assmat");
    const [errorInputId, setErrorInputId] = useState(0);
    const [errorMessageInput, setErrorMessageInput] = useState("Obligatoire");

    async function onPressSignUp() {
      setErrorInputId(0);
      setErrorMessage("");
      setErrorMessageInput("Obligatoire");
      if (!prenom) {
        setErrorInputId(1);
        return;
      }
      if (!nom) {
        setErrorInputId(2);
        return;
      }
      if (!email) {
        setErrorInputId(3);
        return;
      }
      if (!password) {
        setErrorInputId(4);
        return;
      }
        if (!checked) {
            setErrorMessage("Merci d'accepter les conditions d'utilisation");
            return;
        }
        setLoading(true);
        setErrorMessage("");
        const { error } = await handleSignUp(nom, prenom, email, password, role);
        if (error) {
          if (error.includes("Password should be at least 6 characters")) {
            setErrorInputId(4);
            setErrorMessageInput("Au minimum 6 characters");
            setLoading(false);
            return;
          }
          if (error.includes("User already registered")) {
            setErrorMessage("L'adresse email est déja utilisée")
            setLoading(false);
            return;
          }
            setErrorMessage(error);
            setLoading(false);
            return;
        }
        setLoading(false);
        router.replace("/");
    }

    return (
        <View className="flex-column">
            <View className="flex-row gap-7 mt-10">
                <View className="flex-row items-center gap-4">
                    <Checkbox value={role === "assmat"} onValueChange={() => setRole("assmat")} color={role === "assmat" ? "#7C3AED" : undefined} className=""></Checkbox>
                    <Text className="font-inter-semibold text-[14px] text-[#7A6C8C]">Assmat</Text>
                </View>
                <View className="flex-row items-center gap-4">
                    <Checkbox value={role === "parent"} onValueChange={() => setRole("parent")} color={role === "parent" ? "#7C3AED" : undefined} className=""></Checkbox>
                    <Text className="font-inter-semibold text-[14px] text-[#7A6C8C]">Parent</Text>
                </View>
            </View>
            <View className="mt-6 flex-row self-center">
                <View className="w-[40%]">
                    <Text className="font-inter-bold text-ink">Prénom</Text>
                    <TextInput autoCapitalize="words" value={prenom} onChangeText={setPrenom}  className={`mt-2 font-inter-regular border-[1px] rounded-[10px] bg-white pl-2 ${errorInputId === 1 ? "border-red-300" : "border-[#B7A9C9] mb-5"} py-4`} placeholderTextColor="#B7A9C9" placeholder="prénom"></TextInput>
                    {errorInputId === 1 && (<Text className="text-red-500 font-inter-semibold text-[8px] mt-1">{errorMessageInput}</Text>)}
                </View>
                <View className="w-[50%] ml-10">
                    <Text className="font-inter-bold text-ink">Nom</Text>
                    <TextInput autoCapitalize="words" value={nom} onChangeText={setNom} className={`mt-2 font-inter-regular border-[1px] rounded-[10px] bg-white pl-2 ${errorInputId === 2 ? "border-red-300" : "border-[#B7A9C9] mb-5"} py-4`} placeholderTextColor="#B7A9C9" placeholder="nom"></TextInput>
                    {errorInputId === 2 && (<Text className="text-red-500 font-inter-semibold text-[8px] mt-1">{errorMessageInput}</Text>)}
                </View>
            </View>
            <View className="w-full mt-1">
                <Text className="font-inter-bold text-ink">Adresse email</Text>
                <TextInput keyboardType="email-address" autoComplete="email" autoCapitalize="none" value={email} onChangeText={setEmail}  className={`mt-2 border-[1px] rounded-[10px] bg-white pl-2 font-inter-regular ${errorInputId === 3 ? "border-red-300" : "border-[#B7A9C9] mb-5"} py-4`} py-2 placeholderTextColor="#B7A9C9" placeholder="prenom@exemple.com"></TextInput>
                {errorInputId === 3 && (<Text className="text-red-500 font-inter-semibold text-[8px] mt-1 mb-4">{errorMessageInput}</Text>)}
            </View>
            <View className="w-full mt-1">
                <Text className="font-inter-bold text-ink">Mot de passe</Text>
                <TextInput secureTextEntry value={password} onChangeText={setPassword} className={`mt-2 border-[1px] rounded-[10px] bg-white pl-2 font-inter-regular ${errorInputId === 4 ? "border-red-300" : "border-[#B7A9C9] mb-5"} py-4`} placeholderTextColor="#B7A9C9" placeholder="8 caractères minimum"></TextInput>
                {errorInputId === 4 && (<Text className="text-red-500 font-inter-semibold text-[8px] mt-1 mb-4">{errorMessageInput}</Text>)}
            </View>
            <View className="flex-row items-center gap-4">
                <Checkbox value={checked} onValueChange={setcheck} color={checked ? "#7C3AED" : undefined} className=""></Checkbox>
                <Text className="font-inter-semibold text-[14px] text-[#7A6C8C]">J'accepte les <Text className="font_bold text-[#5B21B6]">conditions d'utilisation</Text> et la <Text className="font_bold text-[#5B21B6]">politique de confidentialité</Text></Text>
            </View>
            {errorMessage ? (
                <Text className="text-red-500 text-xs font-inter-semibold mt-2">{errorMessage}</Text>
            ) : null}
            <Pressable className="px-8 h-15 rounded-[17px] shadow-lg justify-center items-center mt-8 bg-violet" onPress={onPressSignUp} disabled={loading}>
                <Text className="font-inter-bold text-white text-[16px]">
                    {loading ? "Création en cours ..." : "Créer ton compte"}
                </Text>
            </Pressable>
        </View>
    )
}