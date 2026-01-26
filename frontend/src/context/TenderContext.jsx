import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { dashboardData } from "../data/dashboardData.js";
import {
  createTender as createTenderApi,
  deleteTender as deleteTenderApi,
  fetchTenders,
  updateTender as updateTenderApi,
} from "../utils/tendersApi.js";

const TenderContext = createContext(null);

const normalize = (value) => value.trim().toLowerCase();

export const TenderProvider = ({ children }) => {
  const yearOptions = Object.keys(dashboardData.years).sort();
  const defaultYear = yearOptions[yearOptions.length - 1];

  const [tendersData, setTendersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState("All");
  const [archivedFilter, setArchivedFilter] = useState("hide");
  const [sortKey, setSortKey] = useState("pin");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await fetchTenders();
        if (isMounted) {
          setTendersData(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error);
          setTendersData([]);
        }
        console.error("Failed to load tenders", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const upsertTender = (items, tender) => {
    const index = items.findIndex((item) => item.id === tender.id);
    if (index === -1) {
      return [...items, tender];
    }
    const next = [...items];
    next[index] = { ...next[index], ...tender };
    return next;
  };

  const addTender = (tender) => {
    setTendersData((prev) => upsertTender(prev, tender));
    createTenderApi(tender)
      .then((created) => {
        if (created) {
          setTendersData((prev) => upsertTender(prev, created));
        }
      })
      .catch((error) => {
        console.error("Failed to create tender", error);
      });
  };

  const updateTender = (id, updates) => {
    if (!id) return;
    setTendersData((prev) =>
      prev.map((tender) =>
        tender.id === id ? { ...tender, ...updates } : tender
      )
    );
    updateTenderApi(id, updates)
      .then((updated) => {
        if (updated) {
          setTendersData((prev) => upsertTender(prev, updated));
        }
      })
      .catch((error) => {
        console.error("Failed to update tender", error);
      });
  };

  const removeTender = (id) => {
    setTendersData((prev) => prev.filter((tender) => tender.id !== id));
    deleteTenderApi(id).catch((error) => {
      console.error("Failed to delete tender", error);
    });
  };

  const filteredTenders = useMemo(() => {
    const query = normalize(search);
    const stageRank = {
      Registration: 0,
      "Pre-Qualification": 1,
      Proposal: 2,
      Negotiation: 3,
      Contract: 4,
    };
    const statusRank = {
      "Not Started": 0,
      "On Progress": 1,
      Done: 2,
      Failed: 3,
    };

    return tendersData
      .filter((tender) => {
        if (archivedFilter !== "show" && tender.archived) {
          return false;
        }

        if (stageFilter !== "All" && tender.stage !== stageFilter) {
          return false;
        }

        if (statusFilter !== "All" && tender.status !== statusFilter) {
          return false;
        }

        if (monthFilter !== "All") {
          const due = new Date(tender.dueDate);
          if (Number.isNaN(due.getTime())) {
            return false;
          }
          if (due.getMonth() !== Number(monthFilter)) {
            return false;
          }
        }

        if (!query) {
          return true;
        }

        return (
          tender.pin.toLowerCase().includes(query) ||
          tender.projectTitle.toLowerCase().includes(query) ||
          tender.client.toLowerCase().includes(query) ||
          tender.location.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        const compareText = (left = "", right = "") =>
          String(left).localeCompare(String(right), undefined, {
            sensitivity: "base",
          });

        switch (sortKey) {
          case "pin":
            return compareText(a.pin, b.pin) * direction;
          case "client":
            return compareText(a.client, b.client) * direction;
          case "consortium":
            return compareText(a.consortium, b.consortium) * direction;
          case "location":
            return compareText(a.location, b.location) * direction;
          case "currency":
            return compareText(a.currency, b.currency) * direction;
          case "stage": {
            const aRank = stageRank[a.stage];
            const bRank = stageRank[b.stage];
            if (aRank !== undefined && bRank !== undefined) {
              return (aRank - bRank) * direction;
            }
            return compareText(a.stage, b.stage) * direction;
          }
          case "status": {
            const aRank = statusRank[a.status];
            const bRank = statusRank[b.status];
            if (aRank !== undefined && bRank !== undefined) {
              return (aRank - bRank) * direction;
            }
            return compareText(a.status, b.status) * direction;
          }
          case "estValue":
            return (a.estValue - b.estValue) * direction;
          case "startDate":
            return (
              (new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime()) *
              direction
            );
          case "dueDate":
            return (
              (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) *
              direction
            );
          case "overdueDays":
            return (a.overdueDays - b.overdueDays) * direction;
          case "remarks":
            return compareText(a.remarks, b.remarks) * direction;
          case "projectTitle":
          default:
            return compareText(a.projectTitle, b.projectTitle) * direction;
        }
      });
  }, [
    tendersData,
    search,
    stageFilter,
    statusFilter,
    monthFilter,
    archivedFilter,
    sortKey,
    sortDirection,
  ]);

  const value = useMemo(
    () => ({
      allTenders: tendersData,
      tenders: filteredTenders,
      selectedYear,
      setSelectedYear,
      search,
      setSearch,
      stageFilter,
      setStageFilter,
      statusFilter,
      setStatusFilter,
      monthFilter,
      setMonthFilter,
      archivedFilter,
      setArchivedFilter,
      sortKey,
      setSortKey,
      sortDirection,
      setSortDirection,
      isLoading,
      loadError,
      addTender,
      updateTender,
      removeTender,
    }),
    [
      tendersData,
      filteredTenders,
      selectedYear,
      search,
      stageFilter,
      statusFilter,
      monthFilter,
      archivedFilter,
      sortKey,
      sortDirection,
      isLoading,
      loadError,
      addTender,
      updateTender,
      removeTender,
    ]
  );

  return (
    <TenderContext.Provider value={value}>
      {children}
    </TenderContext.Provider>
  );
};

export const useTenders = () => {
  const context = useContext(TenderContext);

  if (!context) {
    throw new Error("useTenders must be used inside TenderProvider");
  }

  return context;
};
