import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LabeledInput from '../components/LabeledInput';
import CurrencyChips from '../components/CurrencyChips';

const FREECURRENCY_API_KEY = 'YOUR_API_KEY_HERE';
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
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleReset = (): void => {
    setBaseCurrency('CAD');
    setTargetCurrency('');
    setAmount('1');
    setConvertedAmount(null);
    setExchangeRate(null);
    setErrorMessage('');
    setLastUpdated(null);
  };

  const handleConvert = async (): Promise<void> => {
    setErrorMessage('');
    setConvertedAmount(null);
    setExchangeRate(null);
    setLastUpdated(null);

    const base = baseCurrency.trim().toUpperCase();
    const target = targetCurrency.trim().toUpperCase();
    const amt = amount.trim();

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
      setLastUpdated(new Date().toLocaleString());
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
          {lastUpdated && (
            <Text style={styles.resultTimestamp}>Last updated: {lastUpdated}</Text>
          )}
        </View>
      );
    }

    return null;
  };

  const baseError =
    errorMessage.includes('Base currency') || errorMessage.includes('same')
      ? errorMessage
      : undefined;
  const targetError =
    errorMessage.includes('Destination currency') || errorMessage.includes('same')
      ? errorMessage
      : undefined;
  const amountError = errorMessage.includes('Amount must') ? errorMessage : undefined;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.screen}>
          <Text style={styles.appTitle}>CurrenC</Text>
          <Text style={styles.appSubtitle}>
            Live currency conversion with input validation and error handling.
          </Text>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Currency Conversion</Text>

            <Text style={styles.helperText}>
              Enter 3-letter codes (e.g., CAD, USD, EUR). Amount must be a positive
              number.
            </Text>

            <LabeledInput
              label="Base Currency (e.g., CAD)"
              value={baseCurrency}
              onChangeText={text => setBaseCurrency(text.toUpperCase())}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={3}
              placeholder="CAD"
              required
              error={baseError}
            />

            <CurrencyChips
              label="Quick select"
              currencies={['CAD', 'USD', 'EUR', 'GBP']}
              onSelect={code => setBaseCurrency(code)}
            />

            <LabeledInput
              label="Destination Currency (e.g., USD)"
              value={targetCurrency}
              onChangeText={text => setTargetCurrency(text.toUpperCase())}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={3}
              placeholder="USD"
              required
              error={targetError}
            />

            <CurrencyChips
              label="Quick select"
              currencies={['USD', 'CAD', 'EUR', 'GBP']}
              onSelect={code => setTargetCurrency(code)}
            />

            <LabeledInput
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="1"
              required
              error={amountError}
            />

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

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleReset}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>

            {renderResult()}
          </View>

          <Text style={styles.footer}>
            Built by Henrique Custodio · COMP3074 Assignment 2
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
  },
  screen: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#9ca3af',
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(15,23,42,0.96)',
    shadowColor: '#22d3ee',
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 8,
    textAlign: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#022c22',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 8,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#64748b',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  secondaryButtonText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(15,118,110,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.5)',
  },
  resultMain: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  resultSub: {
    fontSize: 13,
    color: '#a5b4fc',
  },
  resultTimestamp: {
    marginTop: 4,
    fontSize: 11,
    color: '#9ca3af',
  },
  errorText: {
    marginTop: 16,
    color: '#fecaca',
    fontSize: 13,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
  },
});

export default MainScreen;
