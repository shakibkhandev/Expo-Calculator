import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/utils/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, Pressable, useColorScheme } from "react-native";

export default function History() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [history, setHistory] = React.useState<
    { input: string; output: string; timestamp: string }[]
  >([]);

  const fetchHistory = async () => {
    const savedHistory = await AsyncStorage.getItem("history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  };
  const removeHistory = async (item: any) => {
    const savedHistory = await AsyncStorage.getItem("history");
    if (savedHistory) {
      const updatedHistory = JSON.parse(savedHistory).filter(
        (h) => h.timestamp !== item.timestamp
      );
      await AsyncStorage.setItem("history", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }
  };

  const removeAllHistory = async () => {
    await AsyncStorage.setItem("history", JSON.stringify([]));
    setHistory([]);
  };

  useEffect(() => {
    // Get history from AsyncStorage
    fetchHistory();
  }, []);

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={history}
        renderItem={({ item }) => (
          <ThemedView
            style={{
              marginBottom: 10,
              padding: 10,
              backgroundColor:
                colorScheme === "dark" ? Colors.dark : Colors.light,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <ThemedText
              style={{
                fontSize: 18,
                fontWeight: "bold",
                padding: 10,
                flexGrow: 1,
              }}
            >
              {item.input}={item.output}
            </ThemedText>
            <Pressable
              style={{
                width: 100,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
              onPress={() => removeHistory(item)}
            >
              <ThemedText style={{ padding: 10, color: "white" }}>
                Delete
              </ThemedText>
            </Pressable>
          </ThemedView>
        )}
        keyExtractor={(item) => item.timestamp}
        contentContainerStyle={{ paddingTop: 20 }}
        style={{ marginBottom: 60, padding: 10 }}
        ListEmptyComponent={
          <ThemedView className="flex-1 justify-center items-center">
            <ThemedText style={{ fontWeight: "bold", marginTop: 20 }}>
              No Calculations History Found
            </ThemedText>
          </ThemedView>
        }
        ListHeaderComponent={
          <>
            {history.length > 0 && (
              <ThemedText
                style={{
                  fontWeight: "bold",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                Calculation History
              </ThemedText>
            )}
          </>
        }
        ListFooterComponent={
          <>
            {history.length > 0 && (
              <ThemedText
                style={{
                  fontWeight: "bold",
                  marginBottom: 20,
                  textAlign: "center",
                }}
              >
                End of History
              </ThemedText>
            )}
          </>
        }
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />

      <Pressable
        style={{
          width: "90%",
          backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 5,
          marginHorizontal: 20,
          position: "absolute",
          bottom: 20,
          zIndex: 100,
        }}
        onPress={() => removeAllHistory()}
      >
        <ThemedText style={{ padding: 10, color: "white" }}>
          Delete All
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}
