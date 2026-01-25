import { useMemo } from "react";

import { stageOrder, statusOrder } from "../../../utils/tenderUtils.js";

const MONTH_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Jan", value: "0" },
  { label: "Feb", value: "1" },
  { label: "Mar", value: "2" },
  { label: "Apr", value: "3" },
  { label: "May", value: "4" },
  { label: "Jun", value: "5" },
  { label: "Jul", value: "6" },
  { label: "Aug", value: "7" },
  { label: "Sep", value: "8" },
  { label: "Oct", value: "9" },
  { label: "Nov", value: "10" },
  { label: "Dec", value: "11" },
];

const useTenderFilters = ({
  allTenders,
  setSearch,
  setStageFilter,
  setStatusFilter,
  setMonthFilter,
  setSortKey,
  setSortDirection,
}) => {
  const stageOptions = useMemo(() => {
    const stages = new Set(allTenders.map((tender) => tender.stage));
    const ordered = stageOrder.filter((stage) => stages.has(stage));
    const extras = [...stages]
      .filter((stage) => !stageOrder.includes(stage))
      .sort();

    return ["All", ...ordered, ...extras];
  }, [allTenders]);

  const statusOptions = useMemo(() => {
    const statuses = new Set(allTenders.map((tender) => tender.status));
    const ordered = statusOrder.filter((status) => statuses.has(status));
    const extras = [...statuses]
      .filter((status) => !statusOrder.includes(status))
      .sort();

    return ["All", ...ordered, ...extras];
  }, [allTenders]);

  const resetFilters = () => {
    setSearch("");
    setStageFilter("All");
    setStatusFilter("All");
    setMonthFilter("All");
    setSortKey("pin");
    setSortDirection("asc");
  };

  return {
    stageOptions,
    statusOptions,
    monthOptions: MONTH_OPTIONS,
    resetFilters,
  };
};

export default useTenderFilters;
