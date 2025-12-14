import React, { useEffect } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Uploads from "./Uploads/Uploads";
import Analytics from "./Analytics/Analytics";
import Profile from "./Profile/Profile";
import Ionicons from '@expo/vector-icons/Ionicons';
import theme from "./global/theme";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, StackActions } from "@react-navigation/native";
import type { Receipt } from "./redux/apiSlice";
import { useGetUserReceiptsQuery, useGetCurrentNumProcessingDocsQuery } from "./redux/apiSlice";
import { clearUser, setCurrentNumProcessingDocs, setReceiptsList, setIsGlobalLoading } from "./redux/userSlice";
import { RootState } from "./redux/store";
import Toast from "react-native-toast-message";

type MainTabParamList = {
  Upload: undefined;
  Analytics: undefined;
  Profile: undefined;
};
const Tab = createBottomTabNavigator<MainTabParamList>();

//loads receipts & num processing, passes these into redux store, used as needed elsewhere
export default function Main() {
  const userSlice = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  //useState w/ loadingModalVisible

  const { data: receiptsData, //undefined while loading
          error: receiptsError, 
          isLoading: receiptsIsLoading 
        } = useGetUserReceiptsQuery(userSlice.id!, {
    skip: !userSlice.id,
  });

  const { data: currentNumProcessingDocsData, //undefined while loading
          error: currentNumProcessingDocsError, 
          isLoading: currentNumProcessingDocsLoading 
        } = useGetCurrentNumProcessingDocsQuery(userSlice.id!, {
    skip: !userSlice.id,
  });

  //nature of rtk query: we invalidate all caches in children, queries are called again here, then redux store updated
  useEffect(() => { //dispatches will not execute while data is undefined (isLoading state = true)
    if(currentNumProcessingDocsData) { 
      dispatch(setCurrentNumProcessingDocs(currentNumProcessingDocsData)); 
    }
    if(receiptsData) { 
      dispatch(setReceiptsList(receiptsData)); 
    }
  }, [receiptsData, currentNumProcessingDocsData]); //update redux store only when fetched data changes state

  //isGlobalLoading state is OR truth table
  //rtk query useQuery and useMutation re-render component per request
  useEffect(() => {
    dispatch(setIsGlobalLoading(receiptsIsLoading || currentNumProcessingDocsLoading));
  }, [receiptsIsLoading, currentNumProcessingDocsLoading]);

  if(receiptsError || currentNumProcessingDocsError) { SignOut(); } //jank but works

  function SignOut() {
    GoogleSignin.signOut();
    dispatch(clearUser());
    navigation.dispatch(StackActions.replace('SignIn'));
    console.log(`signed out | ${JSON.stringify(userSlice)}`);
    Toast.show({
      type: 'error',
      text1: "SIGNED OUT",
      text2: "ERROR - PLEASE CONTACT SUPPORT",
      visibilityTime: 2000,
    });
  }

  //.Screen route options: https://reactnavigation.org/docs/screen/#options
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