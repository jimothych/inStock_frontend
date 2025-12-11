import * as React from 'react';
import { View, Text } from 'react-native';
import { registerRootComponent } from 'expo';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './src/SignIn';
import Main from './src/Main';
import Toast from 'react-native-toast-message';
import { StaticParamList } from '@react-navigation/native';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';

//https://reactnavigation.org/docs/typescript
type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Sign In',
  screens: {
    'Sign In': {
      screen: SignIn,
      options: { headerShown: false }
    },
    'Main': { //this will contain the tab navigator
      screen: Main,
      options: { headerShown: false }
    }
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <>
      <Provider store={store}>
        <Navigation />
      </Provider>
      <Toast />
    </>
  );
}

registerRootComponent(App);