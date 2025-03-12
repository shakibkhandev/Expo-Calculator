import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import React from "react";
import { Button, Form, Input, Label, Spinner } from "tamagui";

export default function scale() {
  const [oldUnit, setOldUnit] = React.useState("m");
  const [newUnit, setNewUnit] = React.useState("km");
  const [amount, setAmount] = React.useState(1200);
  const [convertedAmount, setConvertedAmount] = React.useState("");
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState<
    "off" | "submitting" | "submitted"
  >("off");

  const options = {
    method: "GET",
    url: "https://measurement-unit-converter.p.rapidapi.com/length",
    params: {
      value: amount.toString(),
      from: oldUnit,
      to: newUnit,
    },
    headers: {
      "x-rapidapi-key": process.env.EXPO_PUBLIC_X_RAPID_API_KEY,
      "x-rapidapi-host": "measurement-unit-converter.p.rapidapi.com",
    },
  };

  const convertUnit = async () => {
    if (!amount || !oldUnit || !newUnit) {
      alert("Please enter all values");
      return;
    }

    try {
      setStatus("submitting");
      const { data } = await axios.request(options);

      setConvertedAmount(data.result);
      setStatus("submitted");
    } catch (error) {
      setError((error as any).message);
      setStatus("off");
      console.log((error as any).message);
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Form style={{ padding: 20, gap: 10 }}>
        <Input
          size={20}
          placeholder="Enter Amount"
          onChangeText={(e) => setAmount(parseInt(e))}
          value={amount.toString()}
          keyboardType="numeric"
        />
        <Input
          size={20}
          placeholder="Old Unit"
          onChangeText={(e) => setOldUnit(e.toLowerCase())}
          value={oldUnit}
        />
        <Input
          size={20}
          placeholder="New Unit"
          onChangeText={(e) => setNewUnit(e.toLowerCase())}
          value={newUnit}
        />
        <Button
          icon={status === "submitting" ? () => <Spinner /> : undefined}
          onPress={() => convertUnit()}
        >
          Submit
        </Button>
      </Form>

      <Label style={{ color: "white", fontSize: 20, textAlign: "center" }}>
        {convertedAmount && `Converted Amount: ${convertedAmount}`}
      </Label>
      {error && <Label style={{ color: "red" }}>{error}</Label>}
    </ThemedView>
  );
}
