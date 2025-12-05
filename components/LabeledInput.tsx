import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';

type LabeledInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  error?: string;
} & TextInputProps;

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  value,
  onChangeText,
  required = false,
  error,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, !!error && styles.inputError]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor="#9ca3af"
          {...textInputProps}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  required: {
    color: '#ef4444',
  },
  inputWrapper: {
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#b91c1c',
  },
});

export default LabeledInput;
