//src\screens\EventDetailScreen.js
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  Button,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { auth, db } from "../firebase/firebaseConfig";
import {
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import RatingStars from "../components/RatingStars";
import CommentItem from "../components/CommentItem";

export default function EventDetailScreen({ route }) {
  const { id } = route.params;
  const uid = auth.currentUser.uid;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGoing, setIsGoing] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);

  // Cargo el evento en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "eventos", id), (snap) => {
      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    });
    return () => unsub();
  }, [id]);

  // Cargo estado de RSVP
  useEffect(() => {
    if (!event) return;
    const unsub = onSnapshot(doc(db, "eventos", id, "attendees", uid), (snap) =>
      setIsGoing(snap.exists() && snap.data().status === "going")
    );
    return () => unsub();
  }, [id, uid, event]);

  // Comments sólo si el evento ya pasó
  const isPast = event?.fechaInicio?.toDate() < new Date();
  useEffect(() => {
    if (!isPast) return;
    const q = query(
      collection(db, "eventos", id, "comments"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [id, isPast]);

  const handleRSVP = async () => {
    try {
      const ref = doc(db, "eventos", id, "attendees", uid);
      if (isGoing) await deleteDoc(ref);
      else await setDoc(ref, { status: "going", timestamp: serverTimestamp() });
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || newRating < 1) {
      return Alert.alert(
        "Atención",
        "Comentario y calificación son requeridos"
      );
    }
    try {
      await addDoc(collection(db, "eventos", id, "comments"), {
        uid,
        text: newComment,
        rating: newRating,
        createdAt: serverTimestamp(),
      });
      setNewComment("");
      setNewRating(0);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading || !event) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <Image source={{ uri: event.imageURL }} style={styles.banner} />
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={16} color="#555" />
          <Text style={styles.meta}>
            {event.fechaInicio.toDate().toLocaleString()}
          </Text>
        </View>
        {event.location?.address && (
          <View style={styles.row}>
            <Ionicons name="location-outline" size={16} color="#555" />
            <Text style={styles.meta}>{event.location.address}</Text>
          </View>
        )}
        <Text style={styles.desc}>{event.description}</Text>

        <Button
          title={isGoing ? "Cancelar asistencia" : "Confirmar asistencia"}
          onPress={handleRSVP}
        />

        {isPast && (
          <>
            <Text style={styles.sectionTitle}>Comentarios</Text>
            <RatingStars rating={newRating} onChange={setNewRating} />
            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Escribe tu comentario..."
              style={styles.input}
            />
            <Button title="Publicar" onPress={handleAddComment} />
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CommentItem
                  userId={item.uid}
                  text={item.text}
                  rating={item.rating}
                  date={item.createdAt.toDate()}
                />
              )}
              ListEmptyComponent={
                <Text style={{ textAlign: "center", marginTop: 16 }}>
                  Sé el primero en comentar.
                </Text>
              }
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  banner: { width: "100%", height: 200 },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  meta: { marginLeft: 6, color: "#555" },
  desc: { fontSize: 16, lineHeight: 22, marginVertical: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginVertical: 8,
  },
});
