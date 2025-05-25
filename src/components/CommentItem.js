//src\components\CommentItem.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import RatingStars from "./RatingStars";

export default function CommentItem({ userId, text, rating, date }) {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", userId));
        if (snap.exists()) setUserEmail(snap.data().email);
      } catch {}
    })();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.user}>{userEmail || "Usuario"}</Text>
      <RatingStars rating={rating} onChange={() => {}} size={16} />
      <Text style={styles.date}>{date.toLocaleString()}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  user: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    color: "#666",
    marginVertical: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
});
