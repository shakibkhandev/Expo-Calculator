import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Button from "./Button";
import { ThemedView } from "./ThemedView";

export default function Calculator() {
  const router = useRouter();
  const [displayValue, setDisplayValue] = React.useState("");
  const [result, setResult] = React.useState(null);

  const colorScheme = useColorScheme();
  const keys = [
    "C",
    "%",
    "⌫",
    "÷",
    "7",
    "8",
    "9",
    "x",
    "6",
    "5",
    "4",
    "-",
    "1",
    "2",
    "3",
    "+",
    "0",
    "00",
    ".",
    "=",
  ];

  const saveHistory = async (calculation: any) => {
    try {
      const savedHistory = await AsyncStorage.getItem("history");
      let parsedHistory = [];
      if (savedHistory) {
        parsedHistory = JSON.parse(savedHistory);
      }
      parsedHistory.push(calculation);
      await AsyncStorage.setItem("history", JSON.stringify(parsedHistory));
    } catch (e) {}
  };

  const handleCalculation = (item: string) => {
    try {
      // Clear button
      if (item === "C") {
        setDisplayValue("");
        setResult(null);
        return;
      }

      // Backspace
      if (item === "⌫") {
        const newDisplayValue = displayValue.slice(0, -1);
        setDisplayValue(newDisplayValue);
        // Only calculate if remaining expression is valid
        if (newDisplayValue && !newDisplayValue.match(/[+\-x÷%]$/)) {
          const calcValue = newDisplayValue.replace("x", "*").replace("÷", "/");
          setResult(eval(calcValue).toString());
        } else {
          setResult(null);
        }
        return;
      }

      // Equals button
      if (item === "=") {
        if (displayValue && !displayValue.match(/[+\-x÷%]$/)) {
          const calcValue = displayValue.replace("x", "*").replace("÷", "/");
          const finalResult = eval(calcValue).toString();
          setResult(finalResult);
          setDisplayValue(finalResult);
          saveHistory({
            input: displayValue,
            output: finalResult,
            timestamp: new Date().toISOString(),
          });
        }
        return;
      }

      // Handle all other inputs
      let newDisplayValue = displayValue + item;

      // Convert multiplication symbol
      if (item === "x") {
        newDisplayValue = displayValue + "*";
      }
      if (item === "÷") {
        newDisplayValue = displayValue + "/";
      }

      setDisplayValue(newDisplayValue);

      // Calculate result only for complete expressions
      const lastChar = newDisplayValue.slice(-1);
      if (!lastChar.match(/[+\-x÷%]/)) {
        const calcValue = newDisplayValue.replace("x", "*").replace("÷", "/");
        setResult(eval(calcValue).toString());
      } else {
        setResult(null);
      }
    } catch (error) {
      setResult(null);
    }
  };

  // Render the calculator keypad with buttons and a clear button
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.display}>
        <ThemedView
          style={{
            flex: 1,
            paddingTop: StatusBar.currentHeight,
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Pressable onPress={() => router.navigate("/history")}>
            <FontAwesome
              name="history"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </Pressable>
          <Pressable onPress={() => router.navigate("/currency")}>
            <MaterialIcons
              name="currency-exchange"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </Pressable>
          <Pressable onPress={() => router.navigate("/scale")}>
            <MaterialIcons
              name="scale"
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
          </Pressable>
        </ThemedView>
        <ThemedView style={{ flex: 1, gap: 10 }}>
          <Text
            style={{
              fontSize: 50,
              fontWeight: "300",
              color: colorScheme === "dark" ? "white" : "black",
            }}
          >
            {displayValue}
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "300",
              color: colorScheme === "dark" ? "white" : "black",
              opacity: 0.5,
              textAlign: "right",
            }}
          >
            {result}
          </Text>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.keypad}>
        <FlatList
          data={keys}
          numColumns={4}
          keyExtractor={(item) => item}
          style={{ gap: 10, marginTop: 20 }}
          contentContainerStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => {
            return (
              <View style={{ flex: 1, padding: 10 }}>
                <Button
                  title={item}
                  type={
                    item == "C"
                      ? "clear"
                      : item == "=" ||
                        item == "+" ||
                        item == "-" ||
                        item == "x" ||
                        item == "÷" ||
                        item == "⌫" ||
                        item == "%"
                      ? "right"
                      : "number"
                  }
                  onPress={() => {
                    handleCalculation(item);
                  }}
                />
              </View>
            );
          }}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  display: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  keypad: {},
});
