const removeKey = (state, key) => {
  if (!(key in state)) return state;
  const next = { ...state };
  delete next[key];
  return next;
};

const useDetailRowActions = ({
  detailIdRef,
  editingCell,
  cancelEditCell,
  beginEditDetailName,
  setDetailRowsByStage,
  setDetailNameByKey,
  setSubitemStatusByKey,
  setSubitemPriorityByKey,
  setSubitemPicByKey,
  setSubitemSubmissionByKey,
  setSubitemAttachmentByKey,
  setSubitemProgressByKey,
  setSubitemTimelineByKey,
  setSubitemNotesByKey,
  setRemovedDetailStepsByStage,
}) => {
  const handleAddDetailRow = (stageKey) => {
    const detailId = detailIdRef.current;
    detailIdRef.current += 1;
    const detailKey = `${stageKey}::detail-${detailId}`;
    setDetailRowsByStage((prev) => ({
      ...prev,
      [stageKey]: [...(prev[stageKey] ?? []), detailKey],
    }));
    beginEditDetailName(detailKey, "");
  };

  const handleDeleteDetailRow = (stageKey, detailKey) => {
    if (
      editingCell?.id === detailKey ||
      (editingCell?.id && editingCell.id.startsWith(`${detailKey}::`))
    ) {
      cancelEditCell();
    }
    setDetailRowsByStage((prev) => {
      const next = { ...prev };
      const updated = (next[stageKey] ?? []).filter((key) => key !== detailKey);
      if (updated.length) {
        next[stageKey] = updated;
      } else {
        delete next[stageKey];
      }
      return next;
    });
    setDetailNameByKey((prev) => removeKey(prev, detailKey));
    setSubitemStatusByKey((prev) => removeKey(prev, detailKey));
    setSubitemPriorityByKey((prev) => removeKey(prev, detailKey));
    setSubitemPicByKey((prev) => removeKey(prev, detailKey));
    setSubitemSubmissionByKey((prev) => removeKey(prev, detailKey));
    setSubitemAttachmentByKey((prev) => removeKey(prev, detailKey));
    setSubitemProgressByKey((prev) => removeKey(prev, detailKey));
    setSubitemTimelineByKey((prev) => removeKey(prev, detailKey));
    setSubitemNotesByKey((prev) => removeKey(prev, detailKey));
  };

  const handleDeleteDetailStep = (stageKey, stepName) => {
    const stepKey = `${stageKey}::${String(stepName)}`;
    if (
      editingCell?.id === stepKey ||
      (editingCell?.id && editingCell.id.startsWith(`${stepKey}::`))
    ) {
      cancelEditCell();
    }
    setRemovedDetailStepsByStage((prev) => {
      const existing = prev[stageKey] ?? [];
      if (existing.includes(stepName)) return prev;
      return { ...prev, [stageKey]: [...existing, stepName] };
    });
    setSubitemStatusByKey((prev) => removeKey(prev, stepKey));
    setSubitemPriorityByKey((prev) => removeKey(prev, stepKey));
    setSubitemPicByKey((prev) => removeKey(prev, stepKey));
    setSubitemSubmissionByKey((prev) => removeKey(prev, stepKey));
    setSubitemAttachmentByKey((prev) => removeKey(prev, stepKey));
    setSubitemProgressByKey((prev) => removeKey(prev, stepKey));
    setSubitemTimelineByKey((prev) => removeKey(prev, stepKey));
    setSubitemNotesByKey((prev) => removeKey(prev, stepKey));
  };

  return {
    handleAddDetailRow,
    handleDeleteDetailRow,
    handleDeleteDetailStep,
  };
};

export default useDetailRowActions;
