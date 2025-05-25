//src\components\RatingStars.js
import React from "react";
import { View, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RatingStars({ rating, onChange, size = 24 }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Pressable key={i} onPress={() => onChange(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={size}
            color="#f1c40f"
            style={{ marginHorizontal: 2 }}
          />
        </Pressable>
      ))}
    </View>
  );
}
