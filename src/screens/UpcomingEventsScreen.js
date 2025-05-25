//src\screens\UpcomingEventsScreen.js
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No hay eventos próximos.</Text>
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
