import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';

type LabeledInputProps = TextInputProps & {
  label: string;
  error?: string;
  required?: boolean;
};

const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  error,
  required,
  ...inputProps
}) => {
  const hasError = !!error;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        placeholderTextColor="#6b7280"
        {...inputProps}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#e5e7eb',
    fontWeight: '600',
  },
  required: {
    marginLeft: 4,
    color: '#f97316',
    fontSize: 12,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#e5e7eb',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  inputError: {
    borderColor: '#f97373',
  },
  errorText: {
    marginTop: 4,
    fontSize: 11,
    color: '#fecaca',
  },
});

export default LabeledInput;
