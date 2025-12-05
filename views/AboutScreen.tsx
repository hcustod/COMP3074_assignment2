import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AboutScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>About CurrenC</Text>

      <Text style={styles.label}>Student Name</Text>
      <Text style={styles.value}>Henrique Custodio</Text>

      <Text style={styles.label}>Student ID</Text>
      <Text style={styles.value}>101497015</Text> {/* update if needed */}

      <Text style={[styles.label, { marginTop: 16 }]}>Description</Text>
      <Text style={styles.text}>
        CurrenC is a React Native Android app for COMP3074. It converts an
        amount from a base currency to a destination currency using live
        exchange rates. The app validates input, calls the FreeCurrencyAPI
        service, and shows both the converted amount and the rate used.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
  },
  text: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default AboutScreen;
