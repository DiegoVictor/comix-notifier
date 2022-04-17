import { useEffect, useState } from "react";
import {StyleSheet, Text, View } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    messaging()
      .getToken()
      .then((deviceToken) => {
        console.log(deviceToken);
        setToken(deviceToken);
      });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Retrieving the device token.</Text>
      <Text style={styles.code}>
        {token || "Failed to get the device token"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  code: {
    backgroundColor: "#eee",
    borderRadius: 15,
    color: "#333",
    marginVertical: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
});
