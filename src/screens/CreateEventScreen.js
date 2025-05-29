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
  Button,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { auth, db } from "../firebase/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  collection,
  setDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

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
  const [loading, setLoading] = useState(false);

  const licenseOptions = [
    "CC BY",
    "CC BY-SA",
    "CC BY-NC",
    "CC BY-ND",
    "CC BY-NC-SA",
    "CC BY-NC-ND",
  ];

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDate(newDate);
      console.log("New date set:", newDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    console.log("Time picker event:", event, selectedTime);

    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }

    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
      console.log("New time set:", newDate);
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitamos acceso a la galería para seleccionar una imagen"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      console.log("Image picker result:", result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        console.log("Image selected:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  const handleCreateEvent = async () => {
    console.log("Creating event with data:", {
      title,
      description,
      date,
      location,
      imageUri,
      license,
    });

    if (!title.trim()) {
      Alert.alert("Error", "El título es requerido");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "La descripción es requerida");
      return;
    }

    if (!imageUri) {
      Alert.alert("Error", "Selecciona una imagen para el evento");
      return;
    }

    if (!auth.currentUser) {
      Alert.alert("Error", "Debes iniciar sesión para crear un evento");
      return;
    }

    setLoading(true);

    try {
      const eventRef = doc(collection(db, "eventos"));
      const eventId = eventRef.id;

      const response = await fetch(imageUri);
      const blob = await response.blob();

      const imageRef = ref(storage, `eventos/${eventId}/banner.jpg`);
      const uploadResult = await uploadBytes(imageRef, blob);

      const imageURL = await getDownloadURL(imageRef);

      const eventData = {
        title: title.trim(),
        description: description.trim(),
        fechaInicio: Timestamp.fromDate(date),
        imageURL,
        location: location.trim(),
        license,
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        attendeesCount: 0,
        ratings: { avg: 0, total: 0 },
      };

      await setDoc(eventRef, eventData);

      Alert.alert("¡Éxito!", "Evento creado correctamente", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", `No se pudo crear el evento: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Crear Evento</Text>

      {/* Título */}
      <View style={styles.field}>
        <Text style={styles.label}>Título del Evento *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa el título del evento"
          value={title}
          onChangeText={setTitle}
          editable={!loading}
        />
      </View>

      {/* Fecha */}
      <View style={styles.field}>
        <Text style={styles.label}>Fecha *</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            setShowDatePicker(true);
          }}
          disabled={loading}
        >
          <Text style={styles.inputText}>
            {date.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}
      </View>

      {/* Hora */}
      <View style={styles.field}>
        <Text style={styles.label}>Hora *</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => {
            setShowTimePicker(true);
          }}
          disabled={loading}
        >
          <Text style={styles.inputText}>
            {date.toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeTime}
          />
        )}
      </View>

      {/* Ubicación */}
      <View style={styles.field}>
        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa la ubicación del evento"
          value={location}
          onChangeText={setLocation}
          editable={!loading}
        />
      </View>

      {/* Descripción */}
      <View style={styles.field}>
        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe tu evento..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          editable={!loading}
        />
      </View>

      {/* Imagen */}
      <View style={styles.field}>
        <Text style={styles.label}>Imagen de portada *</Text>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={pickImage}
          disabled={loading}
        >
          <Text style={styles.imageButtonText}>
            {imageUri ? "Cambiar imagen" : "Seleccionar imagen"}
          </Text>
        </TouchableOpacity>

        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        )}
      </View>

      {/* Licencia */}
      <View style={styles.field}>
        <Text style={styles.label}>Licencia Creative Commons</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={license}
            onValueChange={setLicense}
            enabled={!loading}
          >
            {licenseOptions.map((code) => (
              <Picker.Item key={code} label={code} value={code} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Botón Crear */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleCreateEvent}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creando evento..." : "Crear Evento"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f5f8",
  },
  content: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },

  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    justifyContent: "center",
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  imageButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 8,
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },

  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },

  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
