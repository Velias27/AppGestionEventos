//src\screens\HomeScreen.js
import React from "react";
import { View, Text, Button } from "react-native";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

export default function HomeScreen({ navigation }) {
  const handleLogout = () => {
    signOut(auth).then(() => navigation.replace("Login"));
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>¡Bienvenido, {auth.currentUser?.email}!</Text>
      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar sesión" onPress={handleLogout} />
        <Button
          title="Ir a Eventos"
          onPress={() => navigation.navigate("EventList")}
        />
      </View>
    </View>
  );
}
