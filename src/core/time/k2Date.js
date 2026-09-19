const LEGACY_DATE_PATTERN = /^\s*(\d{1,2})[-/](\d{1,2})[-/](\d{4})/;
const API_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const isValidLocalDate = (year, month, day) => {
  const candidate = new Date(year, month - 1, day);
  return (
    candidate.getFullYear() === year &&
    candidate.getMonth() === month - 1 &&
    candidate.getDate() === day
  );
};

const localDate = (year, month, day) =>
  isValidLocalDate(year, month, day) ? new Date(year, month - 1, day) : null;

export const parseK2Date = (value) => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime())
      ? null
      : new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value !== "string") {
    return null;
  }

  const apiMatch = API_DATE_PATTERN.exec(value);
  if (apiMatch) {
    return localDate(
      Number(apiMatch[1]),
      Number(apiMatch[2]),
      Number(apiMatch[3]),
    );
  }

  const legacyMatch = LEGACY_DATE_PATTERN.exec(value);
  if (legacyMatch) {
    return localDate(
      Number(legacyMatch[3]),
      Number(legacyMatch[2]),
      Number(legacyMatch[1]),
    );
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? null
    : new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const pad = (value) => String(value).padStart(2, "0");

export const formatApiDate = (value) => {
  const date = parseK2Date(value);
  if (!date) {
    return "";
  }

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const formatLegacyK2Date = (value) => {
  const date = parseK2Date(value);
  if (!date) {
    return "";
  }

  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
  }).format(date);
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} 00:00:00 ${weekday}`;
};

const format = (value, locale, options) => {
  const date = parseK2Date(value);
  return date ? new Intl.DateTimeFormat(locale, options).format(date) : "";
};

export const formatK2DateShort = (value, locale = "en-IN") =>
  format(value, locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatK2DateLong = (value, locale = "en-IN") =>
  format(value, locale, {
    day: "numeric",
    month: "long",
    weekday: "long",
    year: "numeric",
  });

export const formatK2DateTime = (value, locale = "en-IN") => {
  if (value instanceof Date || typeof value === "string") {
    const parsed = value instanceof Date ? value : new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        month: "short",
        year: "numeric",
      }).format(parsed);
    }
  }
  return "";
};
