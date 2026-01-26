import { useEffect, useRef, useState } from "react";

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
  archivedFilter,
  onArchivedFilterChange,
  setSortKey,
  setSortDirection,
  onExportMain,
  onExportAll,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportMenuRef = useRef(null);
  const { stageOptions, statusOptions, monthOptions, resetFilters } =
    useTenderFilters({
      allTenders,
      stageFilter,
      statusFilter,
      setSearch: onSearchChange,
      setStageFilter: onStageFilterChange,
      setStatusFilter: onStatusFilterChange,
      setMonthFilter: onMonthFilterChange,
      setArchivedFilter: onArchivedFilterChange,
      setSortKey,
      setSortDirection,
    });

  useEffect(() => {
    if (!isExportOpen) return undefined;
    const handleClick = (event) => {
      if (!exportMenuRef.current?.contains(event.target)) {
        setIsExportOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setIsExportOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isExportOpen]);

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
        <div className="filter-group">
          <label htmlFor="archivedFilter">Archived</label>
          <select
            id="archivedFilter"
            value={archivedFilter}
            onChange={(event) => onArchivedFilterChange(event.target.value)}
          >
            <option value="hide">Hide</option>
            <option value="show">Show</option>
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
        <div className="export-split" ref={exportMenuRef}>
          <button
            className="button button-primary export-main"
            type="button"
            onClick={onExportMain}
          >
            Export
          </button>
          <button
            className="button button-primary export-toggle"
            type="button"
            aria-haspopup="menu"
            aria-expanded={isExportOpen}
            onClick={() => setIsExportOpen((prev) => !prev)}
          >
            <i className="fa-solid fa-chevron-down" aria-hidden="true" />
          </button>
          {isExportOpen ? (
            <div className="export-menu" role="menu">
              <button
                className="export-item"
                type="button"
                onClick={() => {
                  onExportMain();
                  setIsExportOpen(false);
                }}
              >
                Main Table
              </button>
              <button
                className="export-item"
                type="button"
                onClick={() => {
                  onExportAll();
                  setIsExportOpen(false);
                }}
              >
                All Table
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default TenderFilters;
