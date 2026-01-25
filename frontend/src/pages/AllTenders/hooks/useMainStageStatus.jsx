import { useMemo, useState } from "react";
import { getMainStatusOptions } from "../../../utils/tenderUtils.js";

const useMainStageStatus = () => {
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
  };

  const handleMainStatusChange = (id, value) => {
    setMainStatusById((prev) => ({
      ...prev,
      [id]: value,
    }));
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
    [mainStageById, mainStatusById],
  );

  return api;
};

export default useMainStageStatus;
