import { HomepageCalendar } from "@/components/homepage/homepageCalendar";
import { HomepageClock } from "@/components/homepage/homepageClock";
import { HomepageKidsRow } from "@/components/homepage/homepageKidsRow";
import { TopLogo } from "@/components/topLogo";
import "@/global.css";
import { checkSession } from "@/lib/session/checkSession";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HomepageFastActions } from "@/components/homepage/homepageFastActions";
import { getWeekEarnData } from "@/lib/utils/getWeekEarnData"
import { WeekEarnGraph } from "@/components/homepage/graph"
import { StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export function HomepageBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.orb, { backgroundColor: "#F4599F", width: 320, height: 320, top: -110, right: -120, opacity: 0.55 }]} />
      <View style={[styles.orb, { backgroundColor: "#7C3AED", width: 300, height: 300, top: 280, left: -170, opacity: 0.4 }]} />
      <View style={[styles.orb, { backgroundColor: "#b0dba4", width: 260, height: 260, top: 640, right: -120, opacity: 0.5 }]} />
      <BlurView
        intensity={200}
        tint="light"
        blurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  orb: { position: "absolute", borderRadius: 9999 },
});

export default function App() {
  const insets = useSafeAreaInsets();
  const [valideSession, setValideSession] = useState(false);
  const [nbrEnfantInSession, setNbrEnfantInSession] = useState(0);

  useEffect(() => {
    checkSession().then((ok) => {
      if (ok) {
        setValideSession(true);
      }
    });
  }, []);

  if (!valideSession) {
    return null;
  }
  return (
    <View>
      <HomepageBackground></HomepageBackground>
      <ScrollView
        style={{ paddingTop: insets.top }}
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View className="mx-6">
          <TopLogo />
          <HomepageClock />
          <HomepageCalendar />
        </View>
        <HomepageKidsRow />
        <View className="mx-6 mt-12">
          <HomepageFastActions/>
          <Text className="font-inter-bold text-[20px] mt-15">Informations</Text>
          <Text className="font-inter-regular text-ink-faint mt-1">Visualisez les information de la semaine</Text>
          <View className="flex-row justify-between">
            <WeekEarnGraph/>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
