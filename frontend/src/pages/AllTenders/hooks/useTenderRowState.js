import { useMemo } from "react";

import { formatNumber } from "../../../utils/formatters.js";
import { getMainStatusOptions } from "../../../utils/tenderUtils.js";

const useTenderRowState = ({
  tender,
  editedRows,
  mainStageById,
  mainStatusById,
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
    const timelineOverdueDays = overdueDays(displayTender.dueDate);

    return {
      displayTender,
      displayEstValue,
      editEstValue,
      mainStage,
      statusOptions,
      mainStatus,
      timelineOverdueDays,
    };
  }, [editedRows, mainStageById, mainStatusById, overdueDays, tender]);
};

export default useTenderRowState;
