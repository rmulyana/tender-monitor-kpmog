const localeByCurrency = {
  IDR: "id-ID",
  USD: "en-US",
};

export const formatCurrency = (value, currency) => {
  const locale = localeByCurrency[currency] || "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value, currency) => {
  const locale = currency ? localeByCurrency[currency] || "en-US" : "en-US";
  return new Intl.NumberFormat(locale).format(value);
};

export const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const compactUnits = [
  { value: 1e12, symbol: "T" },
  { value: 1e9, symbol: "B" },
  { value: 1e6, symbol: "M" },
  { value: 1e3, symbol: "K" },
];

const currencySymbols = {
  IDR: "Rp",
  USD: "$",
};

export const formatCurrencyCompact = (value, currency = "IDR") => {
  if (!Number.isFinite(value)) {
    return `${currencySymbols[currency] || ""} 0`;
  }

  if (value <= 0) {
    return `${currencySymbols[currency] || currency} -`;
  }

  const unit = compactUnits.find((item) => value >= item.value);
  const formatted = unit
    ? `${(value / unit.value).toFixed(1)} ${unit.symbol}`
    : value.toFixed(0);

  return `${currencySymbols[currency] || currency} ${formatted}`.trim();
};
