export const DASH = "—";

export const val = (value, fallback = DASH) =>
  value === null || value === undefined || value === "" ? fallback : value;

export const fmtDate = (value) => {
  if (!value) return DASH;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const fmtDateTime = (value) => {
  if (!value) return DASH;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${fmtDate(value)}, ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

export const fmtMoney = (value, currency = "OMR") => {
  if (value === null || value === undefined || value === "") return DASH;
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `${num.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency}`;
};

export const yesNo = (value) => {
  if (value === null || value === undefined || value === "") return DASH;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return value;
};
