const SortableHeader = ({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  className = "",
  iconClassFor,
}) => {
  const isActive = activeKey === sortKey;
  const nextDirection =
    isActive && direction === "asc" ? "descending" : "ascending";
  const ariaSort = isActive
    ? direction === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th
      className={`border-b border-slate-200 px-3 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400 ${className}`.trim()}
      aria-sort={ariaSort}
    >
      <div className="flex items-center gap-2">
        <span className={isActive ? "text-slate-700" : ""}>{label}</span>
        <button
          className={`inline-flex items-center text-slate-300 transition hover:text-slate-600 ${isActive ? "text-slate-600" : ""}`}
          type="button"
          aria-label={`Sort by ${label} ${nextDirection}`}
          onClick={() => onSort(sortKey)}
        >
          <i className={`fa-solid ${iconClassFor(sortKey)}`} aria-hidden="true" />
        </button>
      </div>
    </th>
  );
};

export default SortableHeader;
