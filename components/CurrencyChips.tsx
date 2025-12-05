import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type CurrencyChipsProps = {
  label?: string;
  currencies: string[];
  onSelect: (code: string) => void;
};

const CurrencyChips: React.FC<CurrencyChipsProps> = ({
  label,
  currencies,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {currencies.map(code => (
          <TouchableOpacity
            key={code}
            style={styles.chip}
            onPress={() => onSelect(code)}
          >
            <Text style={styles.chipText}>{code}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.7)',
    backgroundColor: 'rgba(15,23,42,0.8)',
  },
  chipText: {
    fontSize: 12,
    color: '#e5e7eb',
    fontWeight: '600',
  },
});

export default CurrencyChips;
