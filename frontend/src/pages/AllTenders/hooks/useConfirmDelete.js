import { useEffect, useState } from "react";

const useConfirmDelete = ({
  handleDeleteTender,
  handleDeleteDetailRow,
  handleDeleteDetailStep,
  handleDeleteStageRow,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmSubitemDelete, setConfirmSubitemDelete] = useState(null);

  useEffect(() => {
    if (!confirmDeleteId && !confirmSubitemDelete) return undefined;
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setConfirmDeleteId(null);
        setConfirmSubitemDelete(null);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [confirmDeleteId, confirmSubitemDelete]);

  const confirmDeleteTender = (id) => {
    if (!id) return;
    handleDeleteTender(id);
    setConfirmDeleteId(null);
  };

  const confirmSubitemDeleteAction = (payload) => {
    if (!payload) return;
    if (payload.type === "detail") {
      handleDeleteDetailRow(payload.stageKey, payload.detailKey);
    } else if (payload.type === "step") {
      handleDeleteDetailStep(payload.stageKey, payload.stepName);
    } else {
      handleDeleteStageRow(
        payload.tenderId,
        payload.stageName,
        payload.stageList,
      );
    }
    setConfirmSubitemDelete(null);
  };

  return {
    confirmDeleteId,
    setConfirmDeleteId,
    confirmSubitemDelete,
    setConfirmSubitemDelete,
    confirmDeleteTender,
    confirmSubitemDeleteAction,
  };
};

export default useConfirmDelete;
