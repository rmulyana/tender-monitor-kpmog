import { useEffect, useMemo } from "react";

import { getMainStatusOptions, stageOrder } from "../../../utils/tenderUtils.js";

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
  stageFilter,
  statusFilter,
  setSearch,
  setStageFilter,
  setStatusFilter,
  setMonthFilter,
  setArchivedFilter,
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
    const normalizedStage = stageFilter || "All";
    let baseOptions = [];
    if (normalizedStage === "All") {
      baseOptions = [
        "Initiation",
        "Planning",
        "On Progress",
        "Clarification",
        "Evaluation",
        "Award",
        "Standstill",
        "Letter of Award",
        "Signed",
      ];
    } else {
      baseOptions = getMainStatusOptions(normalizedStage);
    }

    const filteredTenders =
      normalizedStage === "All"
        ? allTenders
        : allTenders.filter((tender) => tender.stage === normalizedStage);

    const extras = new Set(
      filteredTenders
        .map((tender) => tender.status)
        .filter(Boolean)
        .filter((status) => !baseOptions.includes(status) && status !== "Failed"),
    );

    const orderedExtras = [...extras].sort((a, b) =>
      String(a).localeCompare(String(b), undefined, { sensitivity: "base" }),
    );

    const ordered = ["All", ...baseOptions, ...orderedExtras].filter(
      (status) => status !== "Failed",
    );
    ordered.push("Failed");

    return ordered;
  }, [allTenders, stageFilter]);

  useEffect(() => {
    if (statusFilter && !statusOptions.includes(statusFilter)) {
      setStatusFilter("All");
    }
  }, [statusFilter, statusOptions, setStatusFilter]);

  const resetFilters = () => {
    setSearch("");
    setStageFilter("All");
    setStatusFilter("All");
    setMonthFilter("All");
    if (setArchivedFilter) {
      setArchivedFilter("hide");
    }
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
