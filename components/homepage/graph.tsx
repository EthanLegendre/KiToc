import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { getWeekEarnData } from "@/lib/utils/getWeekEarnData";
import { LineChart } from "react-native-gifted-charts";

export function WeekEarnGraph() {
  const [data, setData] = useState<{ value: number; label: string }[] | null>(null);

  useEffect(() => {
    getWeekEarnData().then((dataGet) => {
      setData(dataGet ?? []);
    });
  }, []);

  if (!data) return null;

  const totalMinutes = data.reduce((sum, d) => sum + d.value, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMin = totalMinutes % 60;
  const chartData = data.map((d) => ({
    value: d.value,
    label: d.label,
  }));

  return (
    <View className="mt-10 rounded-[28px] w-[95%] bg-white  px-6 py-6"
      style={{
        shadowColor: "#241934",
        shadowOpacity: 0.06,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 3,
      }}
    >
      <View className="mb-6">
        <Text style={{ fontSize: 11, fontWeight: "600", color: "#ABA1C4", letterSpacing: 0.5, textTransform: "uppercase" }}>
          Cette semaine
        </Text>
        <View className="flex-row items-baseline mt-1">
          <Text style={{ fontSize: 30, fontWeight: "800", color: "#1E1533" }}>{totalHours}</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1E1533", marginRight: 6 }}>h</Text>
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#1E1533" }}>{totalMin}</Text>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#1E1533" }}>min</Text>
        </View>
      </View>

      <LineChart
        data={chartData}
        curved
        thickness={3}
        color="#7C3AED"
        hideDataPoints={false}
        dataPointsColor="#7C3AED"
        dataPointsRadius={4}
        areaChart
        startFillColor="#7C3AED"
        endFillColor="#7C3AED"
        startOpacity={0.12}
        endOpacity={0.12}
        yAxisThickness={0}
        xAxisThickness={0}
        hideYAxisText
        hideRules
        xAxisLabelTextStyle={{
          color: "#ABA1C4",
          fontSize: 11,
          fontWeight: "600",
        }}
        initialSpacing={10}
        endSpacing={5}
        spacing={45}
        isAnimated
        animationDuration={600}
      />
    </View>
  );
}