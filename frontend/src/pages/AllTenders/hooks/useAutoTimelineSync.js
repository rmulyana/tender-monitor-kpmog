import { useEffect } from "react";

import {
  STAGES,
  STAGE_STEPS,
  normalizeStages,
} from "../../../utils/tenderUtils.js";

const pickDateBounds = (values) => {
  let minValue = "";
  let maxValue = "";
  let minTime = null;
  let maxTime = null;
  values.forEach((value) => {
    if (!value) return;
    const time = new Date(value).getTime();
    if (Number.isNaN(time)) return;
    if (minTime === null || time < minTime) {
      minTime = time;
      minValue = value;
    }
    if (maxTime === null || time > maxTime) {
      maxTime = time;
      maxValue = value;
    }
  });
  return { minValue, maxValue };
};

const pickEarlierDate = (candidate, current) => {
  if (!candidate) return current || "";
  if (!current) return candidate;
  const candidateTime = new Date(candidate).getTime();
  const currentTime = new Date(current).getTime();
  if (Number.isNaN(candidateTime) || Number.isNaN(currentTime)) {
    return current || candidate;
  }
  return candidateTime < currentTime ? candidate : current;
};

const pickLaterDate = (candidate, current) => {
  if (!candidate) return current || "";
  if (!current) return candidate;
  const candidateTime = new Date(candidate).getTime();
  const currentTime = new Date(current).getTime();
  if (Number.isNaN(candidateTime) || Number.isNaN(currentTime)) {
    return current || candidate;
  }
  return candidateTime > currentTime ? candidate : current;
};

const getStagesForTender = (tender, customStagesByTender) => {
  const baseStages = Array.isArray(tender.stages)
    ? normalizeStages(tender.stages)
    : STAGES;
  return customStagesByTender[tender.id] ?? baseStages;
};

const useAutoTimelineSync = ({
  tenders,
  customStagesByTender,
  detailRowsByStage,
  subitemTimelineByKey,
  setSubitemTimelineByKey,
  setEditedRows,
}) => {
  useEffect(() => {
    if (!tenders.length) return;
    setSubitemTimelineByKey((prev) => {
      let changed = false;
      const next = { ...prev };

      tenders.forEach((tender) => {
        const stages = getStagesForTender(tender, customStagesByTender);
        stages.forEach((stage) => {
          const stageKey = `${tender.id}::${stage.name}`;
          const detailKeys = detailRowsByStage[stageKey] ?? [];
          const stepNames = Array.isArray(stage.steps)
            ? stage.steps
            : STAGE_STEPS[stage.name] || [];
          const stepKeys = stepNames.map((name) => `${stageKey}::${name}`);
          const keys = [...detailKeys, ...stepKeys];

          if (!keys.length) return;

          const startValues = [];
          const dueValues = [];

          keys.forEach((key) => {
            const timeline = prev[key];
            if (timeline?.startDate) startValues.push(timeline.startDate);
            if (timeline?.dueDate) dueValues.push(timeline.dueDate);
          });

          if (!startValues.length && !dueValues.length) return;

          const { minValue: earliestStart } = pickDateBounds(startValues);
          const { maxValue: latestDue } = pickDateBounds(dueValues);
          const current = prev[stageKey] ?? {};
          const nextStart = pickEarlierDate(earliestStart, current.startDate);
          const nextDue = pickLaterDate(latestDue, current.dueDate);

          if (nextStart !== current.startDate || nextDue !== current.dueDate) {
            next[stageKey] = {
              ...current,
              ...(nextStart ? { startDate: nextStart } : {}),
              ...(nextDue ? { dueDate: nextDue } : {}),
            };
            changed = true;
          }
        });
      });

      return changed ? next : prev;
    });
  }, [
    customStagesByTender,
    detailRowsByStage,
    tenders,
    subitemTimelineByKey,
    setSubitemTimelineByKey,
  ]);

  useEffect(() => {
    if (!tenders.length) return;
    setEditedRows((prev) => {
      let changed = false;
      const next = { ...prev };

      tenders.forEach((tender) => {
        const stages = getStagesForTender(tender, customStagesByTender);
        const stageKeys = stages.map((stage) => `${tender.id}::${stage.name}`);
        const startValues = [];
        const dueValues = [];

        stageKeys.forEach((key) => {
          const timeline = subitemTimelineByKey[key];
          if (timeline?.startDate) startValues.push(timeline.startDate);
          if (timeline?.dueDate) dueValues.push(timeline.dueDate);
        });

        if (!startValues.length && !dueValues.length) return;

        const { minValue: earliestStart } = pickDateBounds(startValues);
        const { maxValue: latestDue } = pickDateBounds(dueValues);
        const overrides = prev[tender.id] ?? {};
        const baseStart = overrides.startDate ?? tender.startDate ?? "";
        const baseDue = overrides.dueDate ?? tender.dueDate ?? "";
        const nextStart = pickEarlierDate(earliestStart, baseStart);
        const nextDue = pickLaterDate(latestDue, baseDue);

        if (nextStart !== baseStart || nextDue !== baseDue) {
          next[tender.id] = {
            ...overrides,
            startDate: nextStart,
            dueDate: nextDue,
          };
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [customStagesByTender, subitemTimelineByKey, tenders, setEditedRows]);
};

export default useAutoTimelineSync;
