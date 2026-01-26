import { useMemo, useState } from "react";
import { getMainStatusOptions } from "../../../utils/tenderUtils.js";

const useMainStageStatus = ({ updateTender } = {}) => {
  const [mainStageById, setMainStageById] = useState({});
  const [mainStatusById, setMainStatusById] = useState({});

  const handleMainStageChange = (id, value) => {
    const nextStatus = getMainStatusOptions(value)[0] || "";
    setMainStageById((prev) => ({
      ...prev,
      [id]: value,
    }));
    setMainStatusById((prev) => ({
      ...prev,
      [id]: nextStatus,
    }));
    if (updateTender) {
      updateTender(id, { stage: value, status: nextStatus, isDraft: false });
    }
  };

  const handleMainStatusChange = (id, value) => {
    setMainStatusById((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (updateTender) {
      updateTender(id, { status: value, isDraft: false });
    }
  };

  const api = useMemo(
    () => ({
      mainStageById,
      setMainStageById,
      mainStatusById,
      setMainStatusById,
      handleMainStageChange,
      handleMainStatusChange,
      getMainStatusOptions,
    }),
    [mainStageById, mainStatusById, updateTender],
  );

  return api;
};

export default useMainStageStatus;
