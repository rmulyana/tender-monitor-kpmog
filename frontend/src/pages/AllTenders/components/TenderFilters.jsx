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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-end gap-4">
        <div className="flex flex-1 items-end gap-4">
          <div className="min-w-[220px]">
            <label
              htmlFor="tenderSearch"
              className="block text-[0.7rem] font-semibold text-slate-400"
            >
              Search
            </label>
            <div className="relative mt-2">
              <i
                className="fa-solid fa-magnifying-glass pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="tenderSearch"
                type="search"
                placeholder="PIN / Project / Client / Etc"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                className="h-8 w-[220px] rounded-full border border-slate-200 bg-white pl-9 pr-4 text-[0.7rem] text-slate-700 outline-none transition hover:border-orange-400 focus:border-orange-400 cursor-pointer"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="stageFilter"
              className="block text-[0.7rem] font-semibold text-slate-400"
            >
              Stage
            </label>
            <select
              id="stageFilter"
              value={stageFilter}
              onChange={(event) => onStageFilterChange(event.target.value)}
              className="mt-2 h-8 min-w-[160px] rounded-full border border-slate-200 bg-white px-4 text-[0.7rem] font-semibold text-slate-700 transition hover:border-orange-400 focus:border-orange-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 cursor-pointer"
            >
              {stageOptions.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="statusFilter"
              className="block text-[0.7rem] font-semibold text-slate-400"
            >
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(event) => onStatusFilterChange(event.target.value)}
              className="mt-2 h-8 min-w-[160px] rounded-full border border-slate-200 bg-white px-4 text-[0.7rem] font-semibold text-slate-700 transition hover:border-orange-400 focus:border-orange-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 cursor-pointer"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="monthFilter"
              className="block text-[0.7rem] font-semibold text-slate-400"
            >
              Month
            </label>
            <select
              id="monthFilter"
              value={monthFilter}
              onChange={(event) => onMonthFilterChange(event.target.value)}
              className="mt-2 h-8 min-w-[120px] rounded-full border border-slate-200 bg-white px-4 text-[0.7rem] font-semibold text-slate-700 transition hover:border-orange-400 focus:border-orange-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 cursor-pointer"
            >
              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="archivedFilter"
              className="block text-[0.7rem] font-semibold text-slate-400"
            >
              Archived
            </label>
            <select
              id="archivedFilter"
              value={archivedFilter}
              onChange={(event) => onArchivedFilterChange(event.target.value)}
              className="mt-2 h-8 min-w-[120px] rounded-full border border-slate-200 bg-white px-4 text-[0.7rem] font-semibold text-slate-700 transition hover:border-orange-400 focus:border-orange-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 cursor-pointer"
            >
              <option value="hide">Hide</option>
              <option value="show">Show</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end">
          <button
            className="h-8 rounded-full border border-slate-200 bg-white px-5 text-[0.7rem] font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-orange-400 cursor-pointer"
            type="button"
            onClick={resetFilters}
          >
            Reset
          </button>
          <div className="relative inline-flex" ref={exportMenuRef}>
            <button
              className="h-8 rounded-l-full bg-orange-500 px-5 text-[0.7rem] font-semibold text-white transition hover:bg-orange-400 hover:border-orange-400 cursor-pointer"
              type="button"
              onClick={onExportMain}
            >
              Export
            </button>
            <button
              className="h-8 rounded-r-full bg-orange-500 px-3 text-[0.7rem] font-semibold text-white transition hover:bg-orange-400 hover:border-orange-400 cursor-pointer"
              type="button"
              aria-haspopup="menu"
              aria-expanded={isExportOpen}
              onClick={() => setIsExportOpen((prev) => !prev)}
            >
              <i className="fa-solid fa-chevron-down" aria-hidden="true" />
            </button>
            {isExportOpen ? (
              <div
                className="absolute right-0 top-full z-20 mt-2 w-36 rounded-xl border border-slate-200 bg-white p-1 text-[0.7rem] shadow-lg"
                role="menu"
              >
                <button
                  className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100 cursor-pointer"
                  type="button"
                  onClick={() => {
                    onExportMain();
                    setIsExportOpen(false);
                  }}
                >
                  Main Table
                </button>
                <button
                  className="w-full rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100 cursor-pointer"
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
      </div>
    </section>
  );
};

export default TenderFilters;
