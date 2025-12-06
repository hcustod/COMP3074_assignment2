import { API_BASE_URL } from '../config';

const CURRENCY_CODE_REGEX = /^[A-Z]{3}$/;

export const isValidCurrencyCode = (code: string): boolean =>
  CURRENCY_CODE_REGEX.test(code);

type ValidationOk = {
  ok: true;
  base: string;
  target: string;
  amount: number;
};

type ValidationError = {
  ok: false;
  errorMessage: string;
};

export function validateConversionInput(
  baseRaw: string,
  targetRaw: string,
  amountRaw: string
): ValidationOk | ValidationError {
  const base = baseRaw.trim().toUpperCase();
  const target = targetRaw.trim().toUpperCase();
  const amtStr = amountRaw.trim();

  if (!isValidCurrencyCode(base)) {
    return {
      ok: false,
      errorMessage:
        'Base currency must be a 3-letter uppercase ISO code (e.g., CAD, USD, EUR).',
    };
  }

  if (!isValidCurrencyCode(target)) {
    return {
      ok: false,
      errorMessage:
        'Destination currency must be a 3-letter uppercase ISO code (e.g., CAD, USD, EUR).',
    };
  }

  if (base === target) {
    return {
      ok: false,
      errorMessage: 'Base and destination currencies cannot be the same.',
    };
  }

  const numericAmount = Number(amtStr);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return {
      ok: false,
      errorMessage: 'Amount must be a positive number.',
    };
  }

  return {
    ok: true,
    base,
    target,
    amount: numericAmount,
  };
}

export type ConversionResult = {
  rate: number;
  converted: number;
  lastUpdated: string;
};

export async function convertCurrencyViaApi(
  base: string,
  target: string,
  amount: number
): Promise<ConversionResult> {
  if (!API_BASE_URL.includes('apikey=')) {
    throw new Error('API key is missing. Please configure FreeCurrencyAPI key.');
  }

  const url =
    `${API_BASE_URL}&base_currency=${encodeURIComponent(base)}` +
    `&currencies=${encodeURIComponent(target)}`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Invalid or unauthorized API key.');
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw new Error(`API error: ${response.status}`);
  }

  const json = (await response.json()) as any;

  if (!json || !json.data || json.data[target] == null) {
    throw new Error('Could not find exchange rate for the specified currencies.');
  }

  const rate = Number(json.data[target]);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('Received an invalid exchange rate from the API.');
  }

  const converted = amount * rate;

  return {
    rate,
    converted,
    lastUpdated: new Date().toLocaleString(),
  };
}
