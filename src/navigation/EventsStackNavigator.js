//src\navigation\EventsStackNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import UpcomingEventsScreen from "../screens/UpcomingEventsScreen";
import CreateEventScreen from "../screens/CreateEventScreen";
import EventDetailScreen from "../screens/EventDetailScreen";

const Stack = createNativeStackNavigator();

export default function EventsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="UpcomingEvents">
      <Stack.Screen
        name="UpcomingEvents"
        component={UpcomingEventsScreen}
        options={{ title: "Eventos", headerShown: false }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{ title: "Crear Evento" }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{ title: "Detalle de evento" }}
      />
    </Stack.Navigator>
  );
}
