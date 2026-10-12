import "@/global.css";
import { Pressable, View, Text, TextInput } from "react-native";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { handleLogin } from "@/lib/handle/handleLogin";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export function LoginForm() {
  const [checked, setcheck] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorInputId, setErrorInputId] = useState(0);
  const [errorMessageInput, setErrorMessageInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function onPresseLogin() {
    setErrorMessage("");
    setLoading(true);
    setErrorMessageInput("Obligatoire")
    setErrorInputId(0)
    if (!email){
      setErrorInputId(1);
      setLoading(false);
      return;
    }
    if (!password){
      setErrorInputId(2);
      setLoading(false);
      return;
    }
    const { error } = await handleLogin(email, password);

    if (error) {
      if (error.includes("credential")) {
        setErrorMessage("Email ou mot de passe incorrect.");
        return;
      }
      setErrorMessage(error);
      return;
    }
    if (checked) {
      await AsyncStorage.setItem("saved_email", email);
    } else {
      await AsyncStorage.removeItem("saved_email");
    }
    router.replace("/");
  }

  useEffect(() => {
    AsyncStorage.getItem("saved_email").then((savedEmail) => {
      if (savedEmail) {
        setEmail(savedEmail);
        setcheck(true);
      }
    });
  }, []);

  return (
    <View className="flex-column">
      <View className="w-full mt-8">
        <Text className="font-inter-bold text-ink">Adresse email</Text>
        <TextInput keyboardType="email-address" value={email} autoComplete="email" autoCapitalize="none" onChangeText={setEmail} className={`mt-2 font-inter-regular border-[1px] rounded-[10px] bg-white pl-2 ${errorInputId === 1 ? "border-red-300" : "border-[#B7A9C9] mb-5"} py-4`}  placeholderTextColor="#B7A9C9" placeholder="prenom@exemple.com"></TextInput>
        {errorInputId === 1 && (<Text className="text-red-500 font-inter-semibold text-[8px] mt-1">{errorMessageInput}</Text>)}
      </View>
      <View className="w-full mt-1">
        <Text className="font-bold text-ink">Mot de passe</Text>
        <View className="w-full mt-1">
            <View className="relative w-full mt-2">
                <TextInput secureTextEntry={!showPassword} value={password} onChangeText={setPassword}className={`mt-2 font-inter-regular border-[1px] rounded-[10px] bg-white pl-2 ${errorInputId === 2 ? "border-red-300" : "border-[#B7A9C9] mb-5"} py-4`}  placeholderTextColor="#B7A9C9" placeholder="••••••••"/>
                {errorInputId === 2 && (<Text className="text-red-500 font-inter-semibold text-[8px] mt-1">{errorMessageInput}</Text>)}
                <Pressable className="absolute right-3 top-0 bottom-0 justify-center" onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={!showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#7A6C8C"/>
                </Pressable>
            </View>
        </View>
      </View>
      {errorMessage ? (
        <Text className="text-red-600 text-xs mt-2 font-inter-semibold">
          {errorMessage}
        </Text>
      ) : null}
      <View className="flex-row items-center mt-4">
        <Checkbox
          value={checked}
          onValueChange={setcheck}
          color={checked ? "#7C3AED" : undefined}
        ></Checkbox>
        <View className="flex-row justify-between w-full">
          <Text className="font-inter-semibold ml-2 text-[12px] text-[#7A6C8C]">Se souvenir de moi</Text>
          <Text className="font-inter-bold mr-5 text-[12px] text-[#D63384]">Mot de passe oublié ?</Text>
        </View>
      </View>
      <Pressable
        onPress={onPresseLogin}
        className="px-8 h-15 rounded-[17px] shadow-xl justify-center items-center mt-10 bg-violet"
      >
        <Text className="font-bold text-white text-[16px]">Se connecter</Text>
      </Pressable>
    </View>
  );
}
