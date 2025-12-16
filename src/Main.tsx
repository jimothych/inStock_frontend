import React, { useEffect, useCallback, useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RecentReceipts from "./RecentReceipts/RecentReceipts";
import Inventory from "./Inventory/Inventory";
import SettingsPage from "./SettingsPage/SettingsPage";
import Ionicons from '@expo/vector-icons/Ionicons';
import theme from "./global/theme";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, StackActions } from "@react-navigation/native";
import { useGetUserReceiptsQuery, useGetCurrentNumProcessingDocsQuery } from "./redux/apiSlice";
import { clearUser, setCurrentNumProcessingDocs, setReceiptsList } from "./redux/userSlice";
import { RootState } from "./redux/store";
import Toast from "react-native-toast-message";
import { DateTime } from "luxon";
import { MainContext } from "./global/MainContext";

type MainTabParamList = {
  RecentReceipts: undefined;
  Inventory: undefined;
  SettingsPage: undefined;
};
const Tab = createBottomTabNavigator<MainTabParamList>();

//loads receipts & num processing, passes these into redux store, used as needed elsewhere
export default function Main() {
  const userSlice = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [currentTime, setCurrentTime] = useState<string>('_');

  //isLoading - When true, indicates that the query is currently loading for the first time, and has no data yet. This will be true for the first request fired off, but not for subsequent requests.
  //isFetching - When true, indicates that the query is currently fetching, but might have data from an earlier request. This will be true for both the first request fired off, as well as subsequent requests.
  //https://redux-toolkit.js.org/rtk-query/usage/queries#frequently-used-query-hook-return-values

  const { data: receiptsData, //undefined while loading
          error: receiptsError, 
          isLoading: receiptsIsLoading, //does not fire after init
          isFetching: receiptsIsFetching,
          refetch: refetchReceipts,
        } = useGetUserReceiptsQuery(userSlice.id!);

  const { data: currentNumProcessingDocsData, //undefined while loading
          error: currentNumProcessingDocsError, 
          isLoading: currentNumProcessingDocsLoading, //does not fire after init
          isFetching: currentNumProcessingDocsIsFetching,
          refetch: refetchNumProcessing,
        } = useGetCurrentNumProcessingDocsQuery(userSlice.id!);

  //handleRefresh passed into Main.Context
  const handleRefresh = useCallback(() => {
    refetchReceipts();
    refetchNumProcessing();
  }, [refetchReceipts, refetchNumProcessing]);

  //HANDLE DATA QUERY STATE
  useEffect(() => { //dispatches will not execute while data is undefined (isLoading state = true)
    //https://moment.github.io/luxon/#/formatting?id=tolocalestring-strings-for-humans

    if(currentNumProcessingDocsData != undefined) { //watch out for falsy 0
      dispatch(setCurrentNumProcessingDocs(currentNumProcessingDocsData));
      console.log(`\tMOUNTED & FETCHED, currentNumProcessingDocsData now CACHED`);
    }
    if(receiptsData) { 
      dispatch(setReceiptsList(receiptsData)); 
      console.log(`\tMOUNTED & FETCHED, receiptsData now CACHED`);
    }
  }, [receiptsData, currentNumProcessingDocsData]); //update redux store only when fetched data changes state

  //isLoading state is OR truth table, passed into Main.Context
  const isLoading = receiptsIsLoading || 
                  currentNumProcessingDocsLoading ||
                  receiptsIsFetching || 
                  currentNumProcessingDocsIsFetching;

  //CHECK isFETCHING STATUS & CACHE, PASS CURRENT TIME TO CONTEXT
  useEffect(() => {
    if (receiptsIsFetching || 
        currentNumProcessingDocsIsFetching ||
        (!receiptsData && currentNumProcessingDocsData === undefined)) {
      return;
    }

    const dt = DateTime.now();
    const now = dt.toLocaleString(DateTime.TIME_WITH_SECONDS);
    setCurrentTime(now); //sending to Main.Context

    const wasCached = (userSlice.receiptsList === receiptsData) &&
                      (userSlice.currentNumProcessingDocs === currentNumProcessingDocsData);

    console.log(`Main.tsx triggered at ${now} - using ${wasCached ? 'cached data to prevent re-rendering' : 'fresh data'}`);
  }, [receiptsIsFetching, currentNumProcessingDocsIsFetching, receiptsData, currentNumProcessingDocsData, userSlice]);

  //HANDLE ERROR QUERY STATE
  useEffect(function handleErrors() {
    if (receiptsError || currentNumProcessingDocsError) { 
      console.error(`receiptsError: ${JSON.stringify(receiptsError)}`);
      console.error(`currentNumProcessingDocsError: ${JSON.stringify(currentNumProcessingDocsError)}`)
      signOutOnError(); 
    }
  }, [receiptsError, currentNumProcessingDocsError]);

  async function signOutOnError() {
    await GoogleSignin.signOut();
    dispatch(clearUser());
    navigation.dispatch(StackActions.replace('SignIn'));
    console.log(`signed out | ${JSON.stringify(userSlice.id)}`);
    Toast.show({
      type: 'error',
      text1: "SIGNED OUT",
      text2: "ERROR - PLEASE CONTACT SUPPORT",
      visibilityTime: 4000,
    });
  }

  //.Screen route options: https://reactnavigation.org/docs/screen/#options
  return (
    <MainContext.Provider 
      value={{ 
        onRefresh: handleRefresh,
        isLoading: isLoading,
        currentTime: currentTime,
      }}
    >
    <Tab.Navigator 
      initialRouteName="RecentReceipts" 
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
        name="RecentReceipts" 
        component={RecentReceipts}
        options={{
          title: "Recent Receipts",
          tabBarIcon: ({ color }) => (
            <Ionicons name="folder-outline" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen 
        name="Inventory"
        component={Inventory}
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => (
            <Ionicons name="analytics-outline" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen 
        name="SettingsPage"
        component={SettingsPage}
        options={{
          title: "SettingsPage",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>    
    </MainContext.Provider>
  );
}