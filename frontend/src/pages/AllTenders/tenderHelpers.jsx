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

const picCell = (name) => {
  const trimmed = String(name || "").trim();
  if (!trimmed) return null;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-500">
        <i className="fa-regular fa-user text-[0.55rem]" aria-hidden="true" />
      </span>
      <span>{trimmed}</span>
    </span>
  );
};

const progressColor = (percent) => {
  if (percent >= 100) return "#10b981";
  if (percent <= 30) return "#ef4444";
  return "#f59e0b";
};

export { nextPinForTenders, picCell, progressColor };
