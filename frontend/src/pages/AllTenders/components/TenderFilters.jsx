import useTenderFilters from "../hooks/useTenderFilters.js";

const TenderFilters = ({
  allTenders,
  search,
  onSearchChange,
  stageFilter,
  onStageFilterChange,
  statusFilter,
  onStatusFilterChange,
  monthFilter,
  onMonthFilterChange,
  setSortKey,
  setSortDirection,
  onExport,
}) => {
  const { stageOptions, statusOptions, monthOptions, resetFilters } =
    useTenderFilters({
      allTenders,
      setSearch: onSearchChange,
      setStageFilter: onStageFilterChange,
      setStatusFilter: onStatusFilterChange,
      setMonthFilter: onMonthFilterChange,
      setSortKey,
      setSortDirection,
    });

  return (
    <section className="tenders-toolbar">
      <div className="toolbar-left">
        <div className="search-group">
          <label htmlFor="tenderSearch">Search</label>
          <div className="search-input">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <input
              id="tenderSearch"
              type="search"
              placeholder="PIN / Project / Client / Etc"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>
        <div className="filter-group">
          <label htmlFor="stageFilter">Stage</label>
          <select
            id="stageFilter"
            value={stageFilter}
            onChange={(event) => onStageFilterChange(event.target.value)}
          >
            {stageOptions.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="monthFilter">Month</label>
          <select
            id="monthFilter"
            value={monthFilter}
            onChange={(event) => onMonthFilterChange(event.target.value)}
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="toolbar-right">
        <button
          className="button button-ghost"
          type="button"
          onClick={resetFilters}
        >
          Reset
        </button>
        <button className="button button-primary" type="button" onClick={onExport}>
          Export
        </button>
      </div>
    </section>
  );
};

export default TenderFilters;
