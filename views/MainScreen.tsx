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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LabeledInput from '../components/LabeledInput';
import CurrencyChips from '../components/CurrencyChips';
import {
  validateConversionInput,
  convertCurrencyViaApi,
} from '../services/currencyService';
import ResultSummary from '../components/ResultSummary';

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

  const handleSwap = (): void => {
    if (!baseCurrency || !targetCurrency) {
      return;
    }
    const prevBase = baseCurrency;
    const prevTarget = targetCurrency;
    setBaseCurrency(prevTarget.toUpperCase());
    setTargetCurrency(prevBase.toUpperCase());
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

    const validation = validateConversionInput(
      baseCurrency,
      targetCurrency,
      amount
    );

    if (!validation.ok) {
      setErrorMessage(validation.errorMessage);
      return;
    }

    const { base, target, amount: numericAmount } = validation;

    setLoading(true);

    try {
      const result = await convertCurrencyViaApi(base, target, numericAmount);
      setExchangeRate(result.rate);
      setConvertedAmount(result.converted);
      setLastUpdated(result.lastUpdated);
    } catch (err: any) {
      console.error('Error while fetching exchange rate:', err);
      setErrorMessage(
        err?.message || 'Network or unexpected error. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const baseError =
    errorMessage.includes('Base currency') || errorMessage.includes('same')
      ? errorMessage
      : undefined;
  const targetError =
    errorMessage.includes('Destination currency') || errorMessage.includes('same')
      ? errorMessage
      : undefined;
  const amountError = errorMessage.includes('Amount must')
    ? errorMessage
    : undefined;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.screen}>
            <Text style={styles.appTitle}>CurrenC</Text>
            <Text style={styles.appSubtitle}>
              Currency conversion with live rates!
            </Text>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Currency Conversion</Text>

              <Text style={styles.helperText}>
                Enter 3-letter codes (e.g., CAD, USD, EUR). The amount must be a positive
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

              <View style={styles.swapRow}>
                <TouchableOpacity
                  style={styles.swapButton}
                  onPress={handleSwap}
                  disabled={!baseCurrency || !targetCurrency}
                >
                  <Text style={styles.swapButtonText}>Swap Currencies</Text>
                </TouchableOpacity>
              </View>

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

              <ResultSummary
                errorMessage={errorMessage}
                convertedAmount={convertedAmount}
                exchangeRate={exchangeRate}
                lastUpdated={lastUpdated}
                amount={amount}
                baseCurrency={baseCurrency}
                targetCurrency={targetCurrency}
              />
            </View>

            <Text style={styles.footer}>
              Built by Henrique Custodio · COMP3074 Assignment 2
            </Text>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  screen: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    color: '#e5e7eb',
    marginBottom: 2,
  },
  appSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    color: '#9ca3af',
    marginBottom: 10,
  },
  card: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(15,23,42,0.96)',
    shadowColor: '#22d3ee',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 6,
    textAlign: 'center',
  },
  helperText: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#22c55e',
    paddingVertical: 11,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#022c22',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    marginTop: 6,
    paddingVertical: 9,
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
  swapRow: {
    alignItems: 'center',
    marginBottom: 4,
    marginTop: 4,
  },
  swapButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.7)',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  swapButtonText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: 12,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 11,
  },
});

export default MainScreen;
