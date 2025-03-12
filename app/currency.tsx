import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import React from "react";
import { Button, Form, Input, Label, Spinner } from "tamagui";

export default function currency() {
  const [status, setStatus] = React.useState<
    "off" | "submitting" | "submitted"
  >("off");
  const [amount, setAmount] = React.useState(1000);
  const [oldCurrency, setOldCurrency] = React.useState("USD");
  const [newCurrency, setNewCurrency] = React.useState("BDT");
  const [convertedAmount, setConvertedAmount] = React.useState("");
  const [error, setError] = React.useState("");

  const convertCurrency = async () => {
    if (!amount || !oldCurrency || !newCurrency) {
      alert("Please enter all values");
      return;
    }

    try {
      setStatus("submitting");
      // Simulate fetching data from an API
      const { data } = await axios.get(
        `https://api.currencyapi.com/v3/latest?apikey=${process.env.EXPO_PUBLIC_API_KEY}&currencies=${newCurrency}&base_currency=${oldCurrency}`
      );
      if (data) {
        const convertAmount = data.data[newCurrency].value * amount;
        setConvertedAmount(convertAmount.toFixed(2));
      }
    } catch (error) {
      setError((error as any).message);
      console.log((error as any).message);
    } finally {
      setStatus("submitted");
    }
  };

  React.useEffect(() => {
    if (status === "submitting") {
      const timer = setTimeout(() => setStatus("off"), 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [status]);

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
          placeholder="Old Currency"
          onChangeText={(e) => setOldCurrency(e.toUpperCase())}
          value={oldCurrency}
        />
        <Input
          size={20}
          placeholder="New Currency"
          onChangeText={(e) => setNewCurrency(e.toUpperCase())}
          value={newCurrency}
        />
        <Button
          icon={status === "submitting" ? () => <Spinner /> : undefined}
          onPress={() => convertCurrency()}
        >
          Submit
        </Button>
      </Form>

      <Label style={{ color: "white", fontSize: 20, textAlign: "center" }}>
        {convertedAmount &&
          `Converted Amount: ${convertedAmount} ${newCurrency}`}
      </Label>
    </ThemedView>
  );
}
