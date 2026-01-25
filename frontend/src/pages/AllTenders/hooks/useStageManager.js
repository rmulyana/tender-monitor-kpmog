import { useState } from "react";

const useStageManager = ({
  editingCell,
  cancelEditCell,
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
  const [expandedStages, setExpandedStages] = useState(() => new Set());
  const [customStagesByTender, setCustomStagesByTender] = useState({});
  const [stagePickerForTender, setStagePickerForTender] = useState(null);
  const [stagePickerValue, setStagePickerValue] = useState("");
  const [customStageValue, setCustomStageValue] = useState("");

  const toggleStage = (key) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleAddStage = (tenderId, stageName, currentStages) => {
    const normalized = String(stageName || "")
      .trim()
      .replace(/\s+/g, " ");
    if (!normalized) return;
    const normalizedKey = normalized.toLowerCase();
    const stageEntry = { name: normalized, steps: [], isManual: true };
    setCustomStagesByTender((prev) => {
      const existing = prev[tenderId] ?? currentStages;
      if (
        existing.some(
          (stage) => stage.name.trim().toLowerCase() === normalizedKey,
        )
      ) {
        return prev;
      }
      return {
        ...prev,
        [tenderId]: [...existing, stageEntry],
      };
    });
    setStagePickerForTender(null);
    setStagePickerValue("");
    setCustomStageValue("");
  };

  const openStagePicker = (tenderId) => {
    setStagePickerForTender(tenderId);
    setStagePickerValue("");
    setCustomStageValue("");
  };

  const pruneStageKeys = (state, stageKey) => {
    const next = {};
    Object.entries(state).forEach(([key, value]) => {
      if (key === stageKey || key.startsWith(`${stageKey}::`)) return;
      next[key] = value;
    });
    return next;
  };

  const handleDeleteStageRow = (tenderId, stageName, currentStages) => {
    const stageKey = `${tenderId}::${stageName}`;
    if (
      editingCell?.id === stageKey ||
      (editingCell?.id && editingCell.id.startsWith(`${stageKey}::`))
    ) {
      cancelEditCell();
    }
    setCustomStagesByTender((prev) => {
      const existing = prev[tenderId] ?? currentStages;
      if (!existing) return prev;
      const nextStages = existing.filter(
        (stage) => stage.name !== stageName,
      );
      return { ...prev, [tenderId]: nextStages };
    });
    setExpandedStages((prev) => {
      if (!prev.size) return prev;
      const next = new Set(prev);
      next.delete(stageKey);
      return next;
    });
    setDetailRowsByStage((prev) => {
      const next = { ...prev };
      delete next[stageKey];
      return next;
    });
    setDetailNameByKey((prev) => pruneStageKeys(prev, stageKey));
    setSubitemStatusByKey((prev) => pruneStageKeys(prev, stageKey));
    setSubitemPriorityByKey((prev) => pruneStageKeys(prev, stageKey));
    setSubitemPicByKey((prev) => pruneStageKeys(prev, stageKey));
    setSubitemSubmissionByKey((prev) => pruneStageKeys(prev, stageKey));
    setSubitemAttachmentByKey((prev) => pruneStageKeys(prev, stageKey));
    setSubitemProgressByKey((prev) => pruneStageKeys(prev, stageKey));
    setSubitemTimelineByKey((prev) => pruneStageKeys(prev, stageKey));
    setSubitemNotesByKey((prev) => pruneStageKeys(prev, stageKey));
    setRemovedDetailStepsByStage((prev) => {
      const next = { ...prev };
      delete next[stageKey];
      return next;
    });
  };

  return {
    expandedStages,
    setExpandedStages,
    customStagesByTender,
    setCustomStagesByTender,
    stagePickerForTender,
    stagePickerValue,
    setStagePickerValue,
    customStageValue,
    setCustomStageValue,
    setStagePickerForTender,
    toggleStage,
    handleAddStage,
    openStagePicker,
    handleDeleteStageRow,
  };
};

export default useStageManager;
