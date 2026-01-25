import { useMemo } from "react";

import { formatNumber } from "../../../utils/formatters.js";
import {
  getMainStatusOptions,
  getPriorityStatus,
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
    const mainStage = mainStageById[tender.id] ?? tender.stage;
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
    const derivedMainStatus =
      childPriorityStatus === "Failed" ? "Failed" : mainStatus;
    const timelineOverdueDays = overdueDays(displayTender.dueDate);

    return {
      displayTender,
      displayEstValue,
      editEstValue,
      mainStage,
      statusOptions,
      mainStatus: derivedMainStatus,
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
