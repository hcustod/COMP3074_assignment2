import 'react-native-gesture-handler';
import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainScreen from './views/MainScreen';
import AboutScreen from './views/AboutScreen';

type RootStackParamList = {
  Main: undefined;
  About: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={({ navigation }) => ({
            title: 'CurrenC',
            headerRight: () => (
              <Button
                title="About"
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
  );
};

export default App;
