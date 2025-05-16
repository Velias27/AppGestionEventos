import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
  const handleLogout = () => {
    signOut(auth).then(() => {
      navigation.replace('Login');
    });
  };

  const probarFirestore = async () => {
    console.log('Tipo de db:', typeof db);
console.log('Contenido de db:', db);

    try {
      const docRef = await addDoc(collection(db, 'pruebas'), {
        mensaje: 'Hola desde la app!',
        uid: auth.currentUser.uid,
        fecha: serverTimestamp()
      });
      console.log('Documento creado con ID:', docRef.id);
      Alert.alert('Éxito', 'Documento creado en Firestore');
    } catch (error) {
      console.error('Error al escribir en Firestore:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>¡Bienvenido, {auth.currentUser?.email}!</Text>
      <Button title="Probar conexión a Firestore" onPress={probarFirestore} />
      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar sesión" onPress={handleLogout} />
      </View>
    </View>
  );
}
