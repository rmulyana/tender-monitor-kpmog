const cloneDetailRowsByStage = (state, oldId, newId) => {
  const next = { ...state };
  Object.entries(state).forEach(([stageKey, detailKeys]) => {
    if (!stageKey.startsWith(`${oldId}::`)) return;
    const nextStageKey = `${newId}${stageKey.slice(oldId.length)}`;
    next[nextStageKey] = detailKeys.map(
      (key) => `${newId}${key.slice(oldId.length)}`,
    );
  });
  return next;
};

const pruneStageMap = (state, tenderId) => {
  const next = {};
  Object.entries(state).forEach(([stageKey, detailKeys]) => {
    if (!stageKey.startsWith(`${tenderId}::`)) {
      next[stageKey] = detailKeys;
    }
  });
  return next;
};

const cloneKeyedState = (state, oldId, newId) => {
  const next = { ...state };
  Object.entries(state).forEach(([key, value]) => {
    if (key.startsWith(`${oldId}::`)) {
      const newKey = `${newId}${key.slice(oldId.length)}`;
      next[newKey] = value;
    }
  });
  return next;
};

const cloneStages = (stages) =>
  (stages || []).map((stage) => {
    if (typeof stage === "string") return stage;
    return {
      ...stage,
      steps: Array.isArray(stage.steps) ? [...stage.steps] : stage.steps,
    };
  });

const pruneKeyPrefix = (state, prefix) => {
  const next = {};
  Object.entries(state).forEach(([key, value]) => {
    if (!key.startsWith(prefix)) {
      next[key] = value;
    }
  });
  return next;
};

const useTenderRowActions = ({
  allTenders,
  editedRows,
  mainStageById,
  mainStatusById,
  customStagesByTender,
  addTender,
  removeTender,
  updateTender,
  setEditedRows,
  setMainStageById,
  setMainStatusById,
  setCustomStagesByTender,
  setExpandedPin,
  setExpandedStages,
  setStagePickerForTender,
  setSubitemStatusByKey,
  setSubitemPriorityByKey,
  setSubitemPicByKey,
  setSubitemSubmissionByKey,
  setSubitemAttachmentByKey,
  setSubitemProgressByKey,
  setDetailRowsByStage,
  setDetailNameByKey,
  setSubitemTimelineByKey,
  setSubitemNotesByKey,
  setRemovedDetailStepsByStage,
  nextIdForTenders,
  nextPinForTenders,
  overdueDays,
}) => {
  const cleanupDraftTender = (id) => {
    removeTender(id);
    setEditedRows((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setMainStageById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setMainStatusById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setCustomStagesByTender((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setExpandedPin((prev) => (prev === id ? null : prev));
    setExpandedStages((prev) => {
      if (!prev.size) return prev;
      const next = new Set();
      prev.forEach((key) => {
        if (!key.startsWith(`${id}::`)) {
          next.add(key);
        }
      });
      return next;
    });
    setStagePickerForTender((prev) => (prev === id ? null : prev));
    setSubitemStatusByKey((prev) => pruneKeyPrefix(prev, `${id}::`));
    setSubitemPriorityByKey((prev) => pruneKeyPrefix(prev, `${id}::`));
    setSubitemPicByKey((prev) => pruneKeyPrefix(prev, `${id}::`));
    setSubitemSubmissionByKey((prev) => pruneKeyPrefix(prev, `${id}::`));
    setSubitemAttachmentByKey((prev) => pruneKeyPrefix(prev, `${id}::`));
    setSubitemProgressByKey((prev) => pruneKeyPrefix(prev, `${id}::`));
    setDetailRowsByStage((prev) => pruneStageMap(prev, id));
    setDetailNameByKey((prev) => pruneKeyPrefix(prev, `${id}::`));
    setSubitemTimelineByKey((prev) => pruneKeyPrefix(prev, `${id}::`));
    setSubitemNotesByKey((prev) => pruneKeyPrefix(prev, `${id}::`));
    if (setRemovedDetailStepsByStage) {
      setRemovedDetailStepsByStage((prev) => pruneStageMap(prev, id));
    }
  };

  const handleDeleteTender = (id) => {
    cleanupDraftTender(id);
  };

  const handleArchiveTender = (id) => {
    if (updateTender) {
      updateTender(id, { archived: true, isDraft: false });
    }
  };

  const handleRestoreTender = (id) => {
    if (updateTender) {
      updateTender(id, { archived: false });
    }
  };

  const handleDuplicateTender = (tender) => {
    const overrides = editedRows[tender.id] ?? {};
    const merged = { ...tender, ...overrides };
    const stageValue = mainStageById[tender.id] ?? merged.stage;
    const statusValue = mainStatusById[tender.id] ?? merged.status;
    const customStages = customStagesByTender[tender.id];
    const providedStages =
      Array.isArray(merged.stages) && merged.stages.length
        ? merged.stages
        : null;
    const sourceStages = customStages ?? providedStages;
    const stagesClone = sourceStages ? cloneStages(sourceStages) : null;
    const nextId = nextIdForTenders(allTenders);
    const nextPin = nextPinForTenders(allTenders);

    const nextTender = {
      ...merged,
      id: nextId,
      pin: nextPin,
      stage: stageValue,
      status: statusValue,
      overdueDays: overdueDays(merged.dueDate),
      archived: false,
      isDraft: false,
    };

    if (stagesClone) {
      nextTender.stages = stagesClone;
    }

    addTender(nextTender);
    setSubitemStatusByKey((prev) => cloneKeyedState(prev, tender.id, nextId));
    setSubitemPriorityByKey((prev) => cloneKeyedState(prev, tender.id, nextId));
    setSubitemPicByKey((prev) => cloneKeyedState(prev, tender.id, nextId));
    setSubitemSubmissionByKey((prev) =>
      cloneKeyedState(prev, tender.id, nextId),
    );
    setSubitemAttachmentByKey((prev) =>
      cloneKeyedState(prev, tender.id, nextId),
    );
    setSubitemProgressByKey((prev) => cloneKeyedState(prev, tender.id, nextId));
    setDetailRowsByStage((prev) =>
      cloneDetailRowsByStage(prev, tender.id, nextId),
    );
    setDetailNameByKey((prev) => cloneKeyedState(prev, tender.id, nextId));
    setSubitemTimelineByKey((prev) => cloneKeyedState(prev, tender.id, nextId));
    setSubitemNotesByKey((prev) => cloneKeyedState(prev, tender.id, nextId));
  };

  return {
    cleanupDraftTender,
    handleDeleteTender,
    handleArchiveTender,
    handleRestoreTender,
    handleDuplicateTender,
  };
};

export default useTenderRowActions;
