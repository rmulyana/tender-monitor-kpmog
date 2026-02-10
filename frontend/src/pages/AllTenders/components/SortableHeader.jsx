import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

const SortableHeader = ({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
  className = "",
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
      className={`border-b border-slate-200 px-3 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-800 ${className}`.trim()}
      aria-sort={ariaSort}
    >
      <div className="flex items-center justify-center gap-2">
        <span className={isActive ? "text-slate-700" : ""}>{label}</span>
        <button
          className={`inline-flex items-center text-slate-300 transition hover:text-slate-600 ${isActive ? "text-slate-600" : ""}`}
          type="button"
          aria-label={`Sort by ${label} ${nextDirection}`}
          onClick={() => onSort(sortKey)}
        >
          {isActive ? (
            direction === "asc" ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )
          ) : (
            <ChevronsUpDown className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </th>
  );
};

export default SortableHeader;
