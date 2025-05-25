//src\components\EventCard.js
import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function EventCard({ title, fechaInicio, imageURL }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageURL }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{fechaInicio.toDate().toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    marginVertical: 8,
    marginHorizontal: 16,
    overflow: "hidden",
  },
  image: {
    width: 80,
    height: 80,
  },
  info: {
    flex: 1,
    padding: 8,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
});
