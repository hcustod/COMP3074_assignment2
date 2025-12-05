import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MainScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CurrenC</Text>
      <Text style={styles.text}>
        This is the main conversion screen. Inputs and API logic will be added
        in the next phases.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default MainScreen;
