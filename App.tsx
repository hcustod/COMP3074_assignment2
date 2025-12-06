import 'react-native-gesture-handler';
import React from 'react';
import { Button, StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './views/MainScreen';
import AboutScreen from './views/AboutScreen';

export type RootStackParamList = {
  Main: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#020617',
    card: '#020617',
    text: '#e5e7eb',
    border: 'rgba(148,163,184,0.5)',
    primary: '#22c55e',
  },
};

const App: React.FC = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#020617',
            },
            headerTintColor: '#e5e7eb',
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
            },
          }}
        >
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={({ navigation }) => ({
              title: 'CurrenC',
              headerRight: () => (
                <Button
                  title="About"
                  color="#22c55e"
                  onPress={() => navigation.navigate('About')}
                />
              ),
            })}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{ title: 'About CurrenC' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
