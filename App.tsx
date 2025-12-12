import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './src/SignIn';
import Main from './src/Main';
import Toast from 'react-native-toast-message';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';

type RootStackParamList = {
  SignIn: undefined;
  Main: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="SignIn" 
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen 
            name="SignIn" 
            component={SignIn} 
            options={{ animation: 'fade'}}
          />
          <Stack.Screen 
            name="Main" 
            component={Main} 
            options={{ animation: 'fade'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
    <Toast />
    </>
  );
}


registerRootComponent(App);