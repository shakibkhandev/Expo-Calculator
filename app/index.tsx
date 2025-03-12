import Calculator from "@/components/Calculator";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function Index() {
  const colorScheme = useColorScheme();
  return (
    <ThemedView className="flex-1 bg-black">
      <Calculator />
    </ThemedView>
  );
}
