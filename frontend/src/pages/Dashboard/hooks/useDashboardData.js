import { useEffect, useMemo, useState } from "react";

import { useTenders } from "../../../context/TenderContext.jsx";
import { formatNumber } from "../../../utils/formatters.js";
import {
  fetchTargetByYear,
  fetchUsdToIdrRate,
  setTargetByYear,
} from "../../../utils/tendersApi.js";
import { isTenderClosed, matchesYearFilter } from "../../../utils/tenderUtils.js";
import {
  MONTH_LABELS,
  USD_TO_IDR_RATE,
  buildMonthlySnapshot,
  buildContractSeries,
  chartColors,
  summaryConfig,
  getStatusMatches,
  normalizeTargetSeries,
  resolveTimelineYear,
  sumEstValue,
} from "../utils/dashboardHelpers.jsx";

const useDashboardData = () => {
  const { allTenders, selectedYear } = useTenders();
  const [displayCurrency, setDisplayCurrency] = useState("IDR");
  const [usdToIdrRate, setUsdToIdrRate] = useState(USD_TO_IDR_RATE);
  const [isRateLoading, setIsRateLoading] = useState(false);
  const [rateToast, setRateToast] = useState("");
  const [targetConfig, setTargetConfig] = useState(null);
  const [isTargetLoading, setIsTargetLoading] = useState(false);
  const [isTargetSaving, setIsTargetSaving] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [targetInputRaw, setTargetInputRaw] = useState("");

  const yearTenders = useMemo(
    () =>
      allTenders.filter(
        (tender) => !tender.archived && matchesYearFilter(tender, selectedYear),
      ),
    [allTenders, selectedYear],
  );
  const labels = MONTH_LABELS;
  const currentMonthIndex = new Date().getMonth();
  const defaultMonth =
    labels[currentMonthIndex] || labels[labels.length - 1] || "Dec";
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  useEffect(() => {
    setSelectedMonth(defaultMonth);
  }, [defaultMonth, selectedYear]);

  const monthIndex = Math.max(labels.indexOf(selectedMonth), 0);
  const timelineYear = useMemo(
    () => resolveTimelineYear(selectedYear),
    [selectedYear],
  );

  useEffect(() => {
    let cancelled = false;
    const loadTarget = async () => {
      setIsTargetLoading(true);
      try {
        const data = await fetchTargetByYear(timelineYear);
        if (!cancelled) {
          setTargetConfig(data);
        }
      } catch {
        if (!cancelled) {
          setTargetConfig(null);
        }
      } finally {
        if (!cancelled) {
          setIsTargetLoading(false);
        }
      }
    };
    loadTarget();
    return () => {
      cancelled = true;
    };
  }, [timelineYear]);

  const targetMonthlySeries = useMemo(
    () => normalizeTargetSeries(targetConfig?.monthlyTargets),
    [targetConfig],
  );

  const snapshot = useMemo(
    () => buildMonthlySnapshot(yearTenders, timelineYear),
    [yearTenders, timelineYear],
  );
  const contractSeries = useMemo(
    () =>
      buildContractSeries(
        yearTenders,
        displayCurrency,
        usdToIdrRate,
        targetMonthlySeries,
      ),
    [yearTenders, displayCurrency, usdToIdrRate, targetMonthlySeries],
  );

  const summaryColumns = useMemo(() => {
    return summaryConfig.map((config) => {
      let rows = [];
      let totalValue = 0;

      if (config.key === "Failed") {
        const failedTenders = yearTenders.filter(
          (tender) => tender.isFailed || tender.status === "Failed",
        );
        rows = config.rows.map((label) => ({
          label: `Lost at ${label}`,
          value: failedTenders.filter((tender) => tender.stage === label).length,
        }));
        totalValue = sumEstValue(failedTenders, displayCurrency, usdToIdrRate);
      } else {
        const stageTenders = yearTenders.filter((tender) => tender.stage === config.key);
        const activeStageTenders = stageTenders.filter(
          (tender) => !(tender.isFailed || tender.status === "Failed"),
        );
        rows = config.rows.map((label) => {
          const matches = getStatusMatches(label);
          return {
            label,
            value: activeStageTenders.filter((tender) =>
              matches.includes(tender.status),
            ).length,
          };
        });
        totalValue = sumEstValue(
          activeStageTenders,
          displayCurrency,
          usdToIdrRate,
        );
      }

      const maxValue = Math.max(...rows.map((row) => row.value), 1);

      return {
        ...config,
        rows: rows.map((row) => ({
          ...row,
          percent: (row.value / maxValue) * 100,
        })),
        totalValue,
      };
    });
  }, [yearTenders, displayCurrency, usdToIdrRate]);

  useEffect(() => {
    if (!rateToast) return undefined;
    const timeoutId = setTimeout(() => setRateToast(""), 2000);
    return () => clearTimeout(timeoutId);
  }, [rateToast]);

  const handleUpdateRate = () => {
    setIsRateLoading(true);
    fetchUsdToIdrRate()
      .then((data) => {
        const nextRate = Number(data?.rate);
        if (Number.isFinite(nextRate) && nextRate > 0) {
          setUsdToIdrRate(nextRate);
          setRateToast(`Rate: ${formatNumber(Math.round(nextRate), "IDR")} (updated)`);
        }
      })
      .finally(() => {
        setIsRateLoading(false);
      });
  };

  const processData = useMemo(
    () => [
      {
        name: "Registration",
        value: snapshot.Registration?.[monthIndex] ?? 0,
        color: chartColors.Registration,
      },
      {
        name: "Pre-Qualification",
        value: snapshot.PQ?.[monthIndex] ?? 0,
        color: chartColors["Pre-Qualification"],
      },
      {
        name: "Proposal",
        value: snapshot.Proposal?.[monthIndex] ?? 0,
        color: chartColors.Proposal,
      },
      {
        name: "Negotiation",
        value: snapshot.Negotiation?.[monthIndex] ?? 0,
        color: chartColors.Negotiation,
      },
      {
        name: "Contract",
        value: snapshot.Contract?.[monthIndex] ?? 0,
        color: chartColors.Contract,
      },
      {
        name: "Failed",
        value: snapshot.Failed?.[monthIndex] ?? 0,
        color: chartColors.Failed,
      },
    ],
    [monthIndex, snapshot],
  );

  const processTotal = useMemo(
    () => processData.reduce((sum, item) => sum + item.value, 0),
    [processData],
  );

  const monthlyStageFlow = useMemo(() => {
    return labels.map((label, index) => ({
      month: label,
      Registration: snapshot.Registration?.[index] ?? 0,
      PreQualification: snapshot.PQ?.[index] ?? 0,
      Proposal: snapshot.Proposal?.[index] ?? 0,
      Negotiation: snapshot.Negotiation?.[index] ?? 0,
      Contract: snapshot.Contract?.[index] ?? 0,
      Failed: snapshot.Failed?.[index] ?? 0,
    }));
  }, [labels, snapshot]);

  const monthlyStageFlowVisible = useMemo(() => {
    const endIndex = Math.max(labels.indexOf(selectedMonth), 0);
    return monthlyStageFlow.slice(0, endIndex + 1);
  }, [labels, monthlyStageFlow, selectedMonth]);

  const stageLegend = useMemo(
    () => [
      {
        value: "Registration",
        type: "circle",
        id: "Registration",
        color: chartColors.Registration,
      },
      {
        value: "Pre-Qualification",
        type: "circle",
        id: "Pre-Qualification",
        color: chartColors["Pre-Qualification"],
      },
      {
        value: "Proposal",
        type: "circle",
        id: "Proposal",
        color: chartColors.Proposal,
      },
      {
        value: "Negotiation",
        type: "circle",
        id: "Negotiation",
        color: chartColors.Negotiation,
      },
      {
        value: "Contract",
        type: "circle",
        id: "Contract",
        color: chartColors.Contract,
      },
      {
        value: "Failed",
        type: "circle",
        id: "Failed",
        color: chartColors.Failed,
      },
    ],
    [],
  );

  const contractValueData = useMemo(() => {
    const { monthly, accumulated, target } = contractSeries;
    const unitAbbreviation = displayCurrency === "IDR" ? "B" : "M";
    const newUnitLabel = `${displayCurrency} ${unitAbbreviation}`;

    return labels.map((label, index) => ({
      month: label,
      monthly: monthly[index],
      accumulated: accumulated[index],
      target: target[index],
      unitLabel: newUnitLabel,
    }));
  }, [contractSeries, labels, displayCurrency]);

  const contractValueVisible = useMemo(() => {
    const endIndex = Math.max(labels.indexOf(selectedMonth), 0);
    return contractValueData.slice(0, endIndex + 1);
  }, [contractValueData, labels, selectedMonth]);

  const activeTargetLabel = useMemo(() => {
    const value = Number(targetConfig?.contractTarget);
    if (!Number.isFinite(value) || value <= 0) return "No target set";
    return `Target: IDR ${formatNumber(value, "IDR")}`;
  }, [targetConfig]);

  const recentTenders = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayMs = 24 * 60 * 60 * 1000;

    return [...yearTenders]
      .filter((tender) => !isTenderClosed(tender))
      .filter((tender) => !Number.isNaN(new Date(tender.dueDate).getTime()))
      .map((tender) => {
        const dueDate = new Date(tender.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffMs = dueDate.getTime() - today.getTime();
        const dueInDays = Number.isFinite(diffMs)
          ? Math.ceil(diffMs / dayMs)
          : 0;

        return {
          ...tender,
          dueDate,
          dueInDays,
        };
      })
      .filter((tender) => tender.dueInDays >= 0)
      .sort((a, b) => a.dueDate - b.dueDate)
      .slice(0, 3)
      .map((tender) => {
        const dueStatus =
          tender.dueInDays < 7
            ? "urgent"
            : tender.dueInDays <= 14
              ? "warn"
              : "ok";
        const dueInLabel =
          tender.dueInDays <= 0 ? "Due today" : `${tender.dueInDays}d left`;

        return {
          ...tender,
          dueStatus,
          dueInLabel,
        };
      });
  }, [yearTenders]);

  const handleTargetEdit = () => {
    const currentValue = Number(targetConfig?.contractTarget) || 0;
    setTargetInputRaw(currentValue ? String(Math.trunc(currentValue)) : "");
    setIsTargetModalOpen(true);
  };

  const handleTargetSave = async (event) => {
    event.preventDefault();
    const numeric = Number(String(targetInputRaw).replace(/[^0-9]/g, ""));
    if (!Number.isFinite(numeric) || numeric < 0) return;

    setIsTargetSaving(true);
    try {
      const saved = await setTargetByYear(timelineYear, numeric);
      setTargetConfig(saved);
      setIsTargetModalOpen(false);
    } finally {
      setIsTargetSaving(false);
    }
  };

  return {
    labels,
    selectedYear,
    displayCurrency,
    setDisplayCurrency,
    usdToIdrRate,
    handleUpdateRate,
    isRateLoading,
    rateToast,
    summaryColumns,
    processData,
    processTotal,
    monthlyStageFlowVisible,
    stageLegend,
    contractValueData,
    contractValueVisible,
    activeTargetLabel,
    recentTenders,
    timelineYear,
    selectedMonth,
    setSelectedMonth,
    isTargetLoading,
    isTargetSaving,
    isTargetModalOpen,
    setIsTargetModalOpen,
    targetInputRaw,
    setTargetInputRaw,
    handleTargetEdit,
    handleTargetSave,
  };
};

export default useDashboardData;
