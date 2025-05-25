//screens\TabsNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IonIcons from "@expo/vector-icons/Ionicons";

import EventListScreen from "../screens/EventListScreen";
import MyEventsScreen from "../screens/MyEventsScreen";
import StatsScreen from "../screens/StatsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Eventos") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Mis Eventos") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "Estadísticas") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline";
          }
          return <IonIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Eventos"
        component={EventListScreen}
        options={{ title: "Eventos" }}
      />
      <Tab.Screen
        name="Mis Eventos"
        component={MyEventsScreen}
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
