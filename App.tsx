import * as React from 'react';
import { View, Text } from 'react-native';
import { registerRootComponent } from 'expo';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './src/SignIn';
import Main from './src/Main';

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Sign In',
  screens: {
    "Sign In": {
      screen: SignIn,
      options: { headerShown: false }
    },
    "Main": { //this will contain the tab navigator
      screen: Main,
      options: { headerShown: false }
    }
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}

registerRootComponent(App);