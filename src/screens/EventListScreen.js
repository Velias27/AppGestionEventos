//screens\EventListScreen.js
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, Image } from "react-native";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function EventListScreen({ navigation }) {
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const now = new Date();
    const q = query(
      collection(db, "eventos"),
      where("fechaInicio", ">=", now),
      orderBy("fechaInicio", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const evts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUpcoming(evts);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("EventDetail", { id: item.id })}
    >
      <Image
        source={{ uri: item.imageURL }}
        style={{
          width: 90,
          height: 90,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          margin: 12,
        }}
      />
      <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
      <Text>{item.fechaInicio.toDate().toLocaleString()}</Text>
      <Text numberOfLines={2}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={upcoming}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 40 }}>
          No hay eventos próximos
        </Text>
      }
    />
  );
}
