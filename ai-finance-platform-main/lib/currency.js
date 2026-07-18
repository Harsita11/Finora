// Supported currencies for account display.
// NOTE: This is DISPLAY-ONLY — amounts are stored as entered, in the account's
// chosen currency. There is no automatic conversion between currencies.
export const SUPPORTED_CURRENCIES = [
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$" },
  { code: "CHF", label: "Swiss Franc", symbol: "CHF" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥" },
];

export const CURRENCY_SYMBOLS = SUPPORTED_CURRENCIES.reduce((acc, c) => {
  acc[c.code] = c.symbol;
  return acc;
}, {});

export function getCurrencySymbol(code) {
  return CURRENCY_SYMBOLS[code] || code || "$";
}

// Formats a number using the account's currency symbol (display-only, no conversion)
export function formatCurrency(amount, code = "INR") {
  const symbol = getCurrencySymbol(code);
  const value = Number(amount || 0).toFixed(2);
  return `${symbol}${value}`;
}
