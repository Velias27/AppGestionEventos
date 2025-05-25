//src\screens\PastEventsScreen.js
import React, { useEffect, useState } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import EventCard from "../components/EventCard";

export default function PastEventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const now = new Date();
    const q = query(
      collection(db, "eventos"),
      where("fechaInicio", "<", now),
      orderBy("fechaInicio", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(list);
    });

    return () => unsubscribe();
  }, []);

  if (events.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No hay eventos pasados.</Text>
      </View>
    );
  }

  return (
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
  );
}
