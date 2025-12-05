import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const FREECURRENCY_API_KEY = '';
const API_URL = 'https://api.freecurrencyapi.com/v1/latest';

const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

const isValidCurrencyCode = (code: string): boolean =>
  CURRENCY_CODE_REGEX.test(code);

const MainScreen: React.FC = () => {
  const [baseCurrency, setBaseCurrency] = useState('CAD');
  const [targetCurrency, setTargetCurrency] = useState('');
  const [amount, setAmount] = useState('1');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async (): Promise<void> => {
    // reset previous output
    setErrorMessage('');
    setConvertedAmount(null);
    setExchangeRate(null);

    const base = baseCurrency.trim().toUpperCase();
    const target = targetCurrency.trim().toUpperCase();
    const amt = amount.trim();

    // validation
    if (!isValidCurrencyCode(base)) {
      setErrorMessage(
        'Base currency must be a 3-letter uppercase ISO code (e.g., CAD, USD, EUR).'
      );
      return;
    }

    if (!isValidCurrencyCode(target)) {
      setErrorMessage(
        'Destination currency must be a 3-letter uppercase ISO code (e.g., CAD, USD, EUR).'
      );
      return;
    }

    if (base === target) {
      setErrorMessage('Base and destination currencies cannot be the same.');
      return;
    }

    const numericAmount = Number(amt);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Amount must be a positive number.');
      return;
    }

    if (!FREECURRENCY_API_KEY || FREECURRENCY_API_KEY === 'YOUR_API_KEY_HERE') {
      setErrorMessage('API key is missing. Please configure FreeCurrencyAPI key.');
      return;
    }

    setLoading(true);

    try {
      const url =
        `${API_URL}?apikey=${encodeURIComponent(FREECURRENCY_API_KEY)}` +
        `&base_currency=${encodeURIComponent(base)}` +
        `&currencies=${encodeURIComponent(target)}`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setErrorMessage('Invalid or unauthorized API key.');
        } else if (response.status === 429) {
          setErrorMessage('Rate limit exceeded. Please try again later.');
        } else {
          setErrorMessage(`API error: ${response.status}`);
        }
        return;
      }

      const json = (await response.json()) as any;

      if (!json || !json.data || json.data[target] == null) {
        setErrorMessage(
          'Could not find exchange rate for the specified currencies.'
        );
        return;
      }

      const rate = Number(json.data[target]);
      if (!Number.isFinite(rate) || rate <= 0) {
        setErrorMessage('Received an invalid exchange rate from the API.');
        return;
      }

      const converted = numericAmount * rate;
      setExchangeRate(rate);
      setConvertedAmount(converted);
    } catch (err: any) {
      console.error('Error while fetching exchange rate:', err);
      setErrorMessage('Network or unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (errorMessage) {
      return <Text style={styles.errorText}>{errorMessage}</Text>;
    }

    if (convertedAmount != null && exchangeRate != null) {
      return (
        <View style={styles.resultBox}>
          <Text style={styles.resultMain}>
            {amount || '1'} {baseCurrency.toUpperCase()} ={' '}
            {convertedAmount.toFixed(2)} {targetCurrency.toUpperCase()}
          </Text>
          <Text style={styles.resultSub}>
            Rate used: 1 {baseCurrency.toUpperCase()} ={' '}
            {exchangeRate.toFixed(6)} {targetCurrency.toUpperCase()}
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>CurrenC</Text>
          <Text style={styles.subtitle}>
            Convert from a base currency to a destination currency using live
            exchange rates.
          </Text>

          <Text style={styles.helperText}>
            Enter 3-letter codes (e.g., CAD, USD, EUR). Amount must be a
            positive number.
          </Text>

          {/* Base currency */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Base Currency (e.g., CAD)</Text>
            <TextInput
              style={styles.input}
              value={baseCurrency}
              onChangeText={setBaseCurrency}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={3}
              placeholder="CAD"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Destination currency */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Destination Currency (e.g., USD)</Text>
            <TextInput
              style={styles.input}
              value={targetCurrency}
              onChangeText={setTargetCurrency}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={3}
              placeholder="USD"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Amount */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Convert button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleConvert}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Convert</Text>
            )}
          </TouchableOpacity>

          {renderResult()}

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Built by Henrique Custodio · COMP3074
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  button: {
    marginTop: 12,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
  },
  resultMain: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  resultSub: {
    fontSize: 13,
    color: '#4b5563',
  },
  errorText: {
    marginTop: 16,
    color: '#b91c1c',
    fontSize: 13,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#6b7280',
  },
});

export default MainScreen;
