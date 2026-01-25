const parseNumericSuffix = (value) => {
  const match = String(value || "").match(/(\d+)/);
  return match ? Number(match[1]) : NaN;
};

const nextPinForTenders = (tenders) => {
  const max = tenders.reduce((current, tender) => {
    const numeric = parseNumericSuffix(tender.pin);
    return Number.isFinite(numeric) ? Math.max(current, numeric) : current;
  }, 0);
  const width = Math.max(3, String(max).length);
  return `K${String(max + 1).padStart(width, "0")}`;
};

const nextIdForTenders = (tenders) => {
  const max = tenders.reduce((current, tender) => {
    const numeric = parseNumericSuffix(tender.id);
    return Number.isFinite(numeric) ? Math.max(current, numeric) : current;
  }, 0);
  return `TND-${String(max + 1).padStart(3, "0")}`;
};

const picCell = (name) => {
  const trimmed = String(name || "").trim();
  if (!trimmed) return null;
  return (
    <span className="pic">
      <span className="pic-avatar">{trimmed.slice(0, 1).toUpperCase()}</span>
      <span>{trimmed}</span>
    </span>
  );
};

const progressColor = (percent) => {
  if (percent >= 100) return "#10b981";
  if (percent <= 30) return "#ef4444";
  return "#f59e0b";
};

export { nextIdForTenders, nextPinForTenders, picCell, progressColor };
