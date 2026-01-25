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
      className={`${className} sortable ${isActive ? "is-sorted" : ""}`.trim()}
      aria-sort={ariaSort}
    >
      <div className="th-sort">
        <span>{label}</span>
        <button
          className={`sort-icon${isActive ? " is-active" : ""}`}
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
