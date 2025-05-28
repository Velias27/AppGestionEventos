// src\navigation\TabsNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";

import EventsStackNavigator from "./EventsStackNavigator"; // ⬅
import PastEventsScreen from "../screens/PastEventsScreen";
import StatsScreen from "../screens/StatsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="EventosTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "EventosTab")
            iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "MisEventos")
            iconName = focused ? "list" : "list-outline";
          else if (route.name === "Estadísticas")
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          else if (route.name === "Perfil")
            iconName = focused ? "person" : "person-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="EventosTab"
        component={EventsStackNavigator}
        options={{ title: "Eventos" }}
      />
      <Tab.Screen
        name="MisEventos"
        component={PastEventsScreen}
        options={{ title: "Mis eventos" }}
      />
      <Tab.Screen
        name="Estadísticas"
        component={StatsScreen}
        options={{ title: "Estadísticas" }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}
