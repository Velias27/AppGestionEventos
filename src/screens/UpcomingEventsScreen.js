// src/screens/UpcomingEventsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import EventCard from "../components/EventCard";

export default function UpcomingEventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const now = new Date();
    const q = query(
      collection(db, "eventos"),
      where("fechaInicio", ">=", now),
      orderBy("fechaInicio", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Upcoming events from Firestore:", list);
      setEvents(list);
    });

    return () => unsubscribe();
  }, []);

  if (events.length === 0) {
    return (
      <View style={styles.empty}>
        <Text>No hay eventos próximos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("EventDetail", { id: item.id })}
          >
            <EventCard
              title={item.title}
              fechaInicio={item.fechaInicio}
              imageURL={item.imageURL}
            />
          </TouchableOpacity>
        )}
      />

      {/* FAB para crear evento */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateEvent")}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 40,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
