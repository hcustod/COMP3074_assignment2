import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutScreen: React.FC = () => {
  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.appTitle}>About CurrenC</Text>
        <Text style={styles.appSubtitle}>
          A minimal but modern currency converter built for COMP3074.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionHeading}>Student Info</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>Henrique Custodio</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Student ID</Text>
            <Text style={styles.value}>101497015</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionHeading}>What this app does</Text>
          <Text style={styles.paragraph}>
            CurrenC converts an amount from a base currency (e.g., CAD) to a
            destination currency (e.g., USD) using live exchange rates from the
            FreeCurrencyAPI service.
          </Text>
          <Text style={styles.paragraph}>
            The app validates that currency codes are 3-letter uppercase ISO
            codes and ensures that the amount is a positive number. If the API
            call succeeds, it displays both the converted amount and the
            exchange rate used.
          </Text>

          <Text style={styles.sectionHeading}>Error handling</Text>
          <Text style={styles.paragraph}>
            The app displays meaningful error messages for invalid input,
            missing or invalid API keys, missing currency data, and general
            network problems.
          </Text>

          <Text style={styles.sectionHeading}>Technologies used</Text>
          <Text style={styles.paragraph}>
            • React Native{' '}
            {'\n'}
            • React Navigation (stack navigation){'\n'}
            • TypeScript for type safety{'\n'}
            • FreeCurrencyAPI for exchange rates
          </Text>
        </View>

        <Text style={styles.footer}>
          COMP3074 · Assignment 2 · Fall 2025
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: 'rgba(15,23,42,0.98)',
    shadowColor: '#22d3ee',
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.4)',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e5e7eb',
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 13,
    color: '#cbd5f5',
    marginTop: 4,
    lineHeight: 19,
  },
  row: {
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  value: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148,163,184,0.4)',
    marginVertical: 14,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 12,
  },
});

export default AboutScreen;
