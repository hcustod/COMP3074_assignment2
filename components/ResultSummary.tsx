import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  errorMessage: string;
  convertedAmount: number | null;
  exchangeRate: number | null;
  lastUpdated: string | null;
  amount: string;
  baseCurrency: string;
  targetCurrency: string;
};

const ResultSummary: React.FC<Props> = ({
  errorMessage,
  convertedAmount,
  exchangeRate,
  lastUpdated,
  amount,
  baseCurrency,
  targetCurrency,
}) => {
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

const styles = StyleSheet.create({
  resultBox: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(15,118,110,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.5)',
  },
  resultMain: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 3,
  },
  resultSub: {
    fontSize: 12,
    color: '#a5b4fc',
  },
  resultTimestamp: {
    marginTop: 3,
    fontSize: 11,
    color: '#9ca3af',
  },
  errorText: {
    marginTop: 10,
    color: '#fecaca',
    fontSize: 13,
  },
});

export default ResultSummary;
