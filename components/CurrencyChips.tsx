import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

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
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {currencies.map(code => {
          const isActive = selected === code;
          return (
            <TouchableOpacity
              key={code}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => {
                setSelected(code);
                onSelect(code);
              }}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {code}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.7)',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  chipActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  chipText: {
    fontSize: 12,
    color: '#e5e7eb',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#022c22',
    fontWeight: '700',
  },
});

export default CurrencyChips;
