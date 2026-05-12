import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  CURRENCY_MARKETS,
  DEFAULT_CURRENCY,
  detectCurrency,
  formatCurrencyAmount,
  readStoredCurrency,
  type SupportedCurrencyCode,
  writeStoredCurrency,
} from './currency';

interface CurrencyContextValue {
  currency: SupportedCurrencyCode;
  countryCode: string;
  locale: string;
  setCurrency: (currency: SupportedCurrencyCode) => void;
  /** `currencyOverride` is usually a Shopify ISO code (may be lowercase or outside the site selector). */
  formatMoney: (amount: number, currencyOverride?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<SupportedCurrencyCode>(() => readStoredCurrency() ?? detectCurrency());

  const setCurrency = useCallback((nextCurrency: SupportedCurrencyCode) => {
    setCurrencyState(nextCurrency);
    writeStoredCurrency(nextCurrency);
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const market = CURRENCY_MARKETS[currency] ?? CURRENCY_MARKETS[DEFAULT_CURRENCY];
    return {
      currency,
      countryCode: market.countryCode,
      locale: market.locale,
      setCurrency,
      formatMoney: (amount, currencyOverride) =>
        formatCurrencyAmount(amount, currencyOverride ?? currency),
    };
  }, [currency, setCurrency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
}
