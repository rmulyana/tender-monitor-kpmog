import { useMemo } from "react";

import { formatNumber } from "../../../utils/formatters.js";
import {
  getMainStatusOptions,
  getPriorityStatus,
  normalizeStages,
  STAGES,
} from "../../../utils/tenderUtils.js";

const useTenderRowState = ({
  tender,
  editedRows,
  mainStageById,
  mainStatusById,
  subitemStatusByKey,
  overdueDays,
}) => {
  return useMemo(() => {
    const overrides = editedRows[tender.id] ?? {};
    const displayTender = { ...tender, ...overrides };
    const displayEstValue = `${displayTender.currency} ${formatNumber(
      displayTender.estValue,
      displayTender.currency,
    )}`;
    const editEstValue = String(displayTender.estValue ?? "");
    const stageList =
      Array.isArray(tender.stages) && tender.stages.length
        ? normalizeStages(tender.stages)
        : STAGES;
    let stageFromSubitems = "";
    stageList.forEach((stage) => {
      const status = subitemStatusByKey?.[`${tender.id}::${stage.name}`];
      if (!status || status === "Not Started") return;
      stageFromSubitems = stage.name;
    });
    const mainStage =
      stageFromSubitems || (mainStageById[tender.id] ?? tender.stage);
    const statusOptions = getMainStatusOptions(mainStage);
    const fallbackMainStatus = statusOptions.includes(tender.status)
      ? tender.status
      : statusOptions[0];
    const storedStatus = mainStatusById[tender.id];
    const mainStatus = statusOptions.includes(storedStatus)
      ? storedStatus
      : fallbackMainStatus;
    const childStatuses = Object.keys(subitemStatusByKey || {})
      .filter((key) => key.startsWith(`${tender.id}::`))
      .map((key) => subitemStatusByKey[key])
      .filter(Boolean);
    const childPriorityStatus = getPriorityStatus(childStatuses);
    const isFailedOverride = childPriorityStatus === "Failed";
    const derivedMainStatus = isFailedOverride ? "Failed" : mainStatus;
    const timelineOverdueDays = overdueDays(displayTender.dueDate);

    return {
      displayTender,
      displayEstValue,
      editEstValue,
      mainStage,
      statusOptions,
      mainStatus: derivedMainStatus,
      isFailedOverride,
      timelineOverdueDays,
    };
  }, [
    editedRows,
    mainStageById,
    mainStatusById,
    overdueDays,
    subitemStatusByKey,
    tender,
  ]);
};

export default useTenderRowState;
