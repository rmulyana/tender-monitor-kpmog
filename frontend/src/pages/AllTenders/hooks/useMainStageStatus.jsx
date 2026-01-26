import { useMemo, useState } from "react";
import { getMainStatusOptions } from "../../../utils/tenderUtils.js";

const hasFailedChildStatus = (id, subitemStatusByKey = {}) =>
  Object.entries(subitemStatusByKey).some(
    ([key, value]) => key.startsWith(`${id}::`) && value === "Failed",
  );

const useMainStageStatus = ({
  updateTender,
  subitemStatusByKey,
} = {}) => {
  const [mainStageById, setMainStageById] = useState({});
  const [mainStatusById, setMainStatusById] = useState({});

  const handleMainStageChange = (id, value) => {
    const nextStatus = getMainStatusOptions(value)[0] || "";
    const hasFailedChild = hasFailedChildStatus(id, subitemStatusByKey);
    setMainStageById((prev) => ({
      ...prev,
      [id]: value,
    }));
    setMainStatusById((prev) => ({
      ...prev,
      [id]: nextStatus,
    }));
    if (updateTender) {
      if (hasFailedChild) {
        updateTender(id, {
          stage: value,
          status: "Failed",
          statusBeforeFailure: nextStatus,
          isDraft: false,
        });
      } else {
        updateTender(id, {
          stage: value,
          status: nextStatus,
          statusBeforeFailure: "",
          isDraft: false,
        });
      }
    }
  };

  const handleMainStatusChange = (id, value) => {
    setMainStatusById((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (updateTender) {
      updateTender(id, { status: value, statusBeforeFailure: "", isDraft: false });
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
    [mainStageById, mainStatusById, updateTender, subitemStatusByKey],
  );

  return api;
};

export default useMainStageStatus;
