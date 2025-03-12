import { useColorScheme } from "@/hooks/useColorScheme";
import { defaultConfig } from "@tamagui/config/v4";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { createTamagui, TamaguiProvider } from "tamagui";
import "./global.css";

const config = createTamagui(defaultConfig);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider defaultTheme={colorScheme as string} config={config}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Calculator",
            headerShown: false,
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#151718" : "#fff",
            },
            headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            title: "History",
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#151718" : "#fff",
            },
            headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
          }}
        />
        <Stack.Screen
          name="currency"
          options={{
            title: "Currency Converter",
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#151718" : "#fff",
            },
            headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
          }}
        />
        <Stack.Screen
          name="scale"
          options={{
            title: "Unit Converter",
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#151718" : "#fff",
            },
            headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
          }}
        />
      </Stack>

      <StatusBar style="auto" />
    </TamaguiProvider>
  );
}
