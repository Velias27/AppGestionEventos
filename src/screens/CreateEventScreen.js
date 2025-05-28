// src/screens/CreateEventScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { auth, db } from "../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, collection, setDoc, serverTimestamp } from "firebase/firestore";

const storage = getStorage();

export default function CreateEventScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [license, setLicense] = useState("CC BY");

  const licenseOptions = [
    "CC BY",
    "CC BY-SA",
    "CC BY-NC",
    "CC BY-ND",
    "CC BY-NC-SA",
    "CC BY-NC-ND",
  ];

  // Fecha
  const onChangeDate = (e, selected) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selected) {
      setDate(
        (prev) =>
          new Date(
            selected.getFullYear(),
            selected.getMonth(),
            selected.getDate(),
            prev.getHours(),
            prev.getMinutes()
          )
      );
    }
  };

  // Hora
  const onChangeTime = (e, selected) => {
    setShowTimePicker(Platform.OS === "ios");
    if (selected) {
      setDate(
        (prev) =>
          new Date(
            prev.getFullYear(),
            prev.getMonth(),
            prev.getDate(),
            selected.getHours(),
            selected.getMinutes()
          )
      );
    }
  };

  // Imagen
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permiso denegado", "Necesitamos acceso a la galería");
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.cancelled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Guardado en Firestore y Storage
  const handleCreateEvent = async () => {
    if (!title.trim() || !description.trim() || !imageUri) {
      return Alert.alert(
        "Faltan campos",
        "Completa título, descripción e imagen"
      );
    }

    try {
      const eventRef = doc(collection(db, "eventos"));
      const eventId = eventRef.id;

      const blob = await (await fetch(imageUri)).blob();
      const imgRef = ref(storage, `eventos/${eventId}/banner.jpg`);
      await uploadBytes(imgRef, blob);
      const imageURL = await getDownloadURL(imgRef);

      await setDoc(eventRef, {
        title,
        description,
        fechaInicio: date,
        imageURL,
        location,
        license,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        attendeesCount: 0,
        ratings: { avg: 0, total: 0 },
      });

      Alert.alert("¡Listo!", "Evento creado correctamente");
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error al crear evento", err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Crear Evento</Text>

      {/* Título */}
      <View style={styles.field}>
        <Text style={styles.label}>Título del Evento</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa el título del evento"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      {/* Fecha */}
      <View style={styles.field}>
        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.inputText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>

      {/* Hora */}
      <View style={styles.field}>
        <Text style={styles.label}>Hora</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.inputText}>
            {date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}
      </View>

      {/* Ubicación */}
      <View style={styles.field}>
        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa la ubicación"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      {/* Descripción */}
      <View style={styles.field}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Ingresa la descripción"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      </View>

      {/* Imagen */}
      <View style={styles.field}>
        <Text style={styles.label}>Imagen de portada</Text>
        <Button title="Seleccionar imagen" onPress={pickImage} />
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        )}
      </View>

      {/* Licencia */}
      <View style={styles.field}>
        <Text style={styles.label}>Licencia Creative Commons</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={license} onValueChange={setLicense}>
            {licenseOptions.map((code) => (
              <Picker.Item key={code} label={code} value={code} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Botón Crear */}
      <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
        <Text style={styles.buttonText}>Crear Evento</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f5f8" },
  content: { padding: 16 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 24 },

  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  inputText: { fontSize: 16, color: "#333" },

  preview: {
    width: "100%",
    height: 200,
    marginTop: 8,
    borderRadius: 8,
  },

  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },

  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
