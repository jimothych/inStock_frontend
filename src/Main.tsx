import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Uploads from "./Uploads/Uploads";
import Analytics from "./Analytics/Analytics";
import Profile from "./Profile/Profile";
import Ionicons from '@expo/vector-icons/Ionicons';
import theme from "./global/theme";

type MainTabParamList = {
  Upload: undefined;
  Analytics: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function Main() {
  return (
    <Tab.Navigator 
      initialRouteName="Upload" 
      screenOptions={{ 
        headerShown: false,
        tabBarIconStyle: { marginTop: 5 },
        tabBarStyle: { backgroundColor: theme.purple1 },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.cyan,
        tabBarInactiveTintColor: theme.white3,
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'Inter_28pt-Regular',
        },
      }}
    >
      <Tab.Screen 
        name="Upload" 
        component={Uploads}
        options={{
          title: "Upload",
          tabBarIcon: ({ color }) => (
            <Ionicons name="folder-outline" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen 
        name="Analytics"
        component={Analytics}
        options={{
          title: "Analytics",
          tabBarIcon: ({ color }) => (
            <Ionicons name="analytics-outline" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile"
        component={Profile}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>    
  );
}