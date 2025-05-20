//screens\EventListScreen.js
import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity, image } from "react-native";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  where,
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

    const unsub = onSnapshot(q, (querySnapshot) => {
      const evts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUpcoming(evts);
    });
    return unsub;
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("EventDetail", { id: item.id })}
    >
      <View
        style={{
          flexDirection: "row",
          margin: 12,
          backgroundColor: "#fff",
          borderRadius: 12,
          elevation: 2,
        }}
      >
        <Image
          source={{ uri: item.imageURL }}
          style={{
            width: 90,
            height: 90,
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
          }}
        />
        <View style={{ flex: 1, padding: 12 }}>
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
          <Text>
            {new Date(item.startDate.seconds * 1000).toLocaleString()}
          </Text>
          <Text numberOfLines={2}>{item.description}</Text>
        </View>
      </View>
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
