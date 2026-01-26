import { useEffect, useRef, useState } from "react";

import { normalizeAttachmentList } from "../../../utils/tenderUtils.js";
import {
  buildSubitemStateFromTenders,
  buildSubitemsPayload,
  resolveStagesForTender,
} from "../../../utils/subitemsMapper.js";

const getTenderIdFromKey = (key) => String(key || "").split("::")[0];

const collectChangedTenderIds = (prev, next, ids) => {
  const prevKeys = Object.keys(prev || {});
  const nextKeys = Object.keys(next || {});
  const allKeys = new Set([...prevKeys, ...nextKeys]);

  allKeys.forEach((key) => {
    if (!Object.is(prev?.[key], next?.[key])) {
      const tenderId = getTenderIdFromKey(key);
      if (tenderId) ids.add(tenderId);
    }
  });
};

const collectStageChanges = (prev, next, ids) => {
  const prevKeys = Object.keys(prev || {});
  const nextKeys = Object.keys(next || {});
  const allKeys = new Set([...prevKeys, ...nextKeys]);

  allKeys.forEach((key) => {
    if (!Object.is(prev?.[key], next?.[key])) {
      ids.add(key);
    }
  });
};

const useSubitemState = ({
  tenders = [],
  customStagesByTender = {},
  updateTender,
  isLoading,
} = {}) => {
  const [subitemStatusByKey, setSubitemStatusByKey] = useState({});
  const [subitemPriorityByKey, setSubitemPriorityByKey] = useState({});
  const [subitemSubmissionByKey, setSubitemSubmissionByKey] = useState({});
  const [subitemAttachmentByKey, setSubitemAttachmentByKey] = useState({});
  const [subitemProgressByKey, setSubitemProgressByKey] = useState({});
  const [detailRowsByStage, setDetailRowsByStage] = useState({});
  const [detailNameByKey, setDetailNameByKey] = useState({});
  const [subitemTimelineByKey, setSubitemTimelineByKey] = useState({});
  const [subitemNotesByKey, setSubitemNotesByKey] = useState({});
  const [subitemPicByKey, setSubitemPicByKey] = useState({});
  const [removedDetailStepsByStage, setRemovedDetailStepsByStage] = useState({});
  const [hasHydrated, setHasHydrated] = useState(false);

  const previousRef = useRef({
    subitemStatusByKey: {},
    subitemPriorityByKey: {},
    subitemSubmissionByKey: {},
    subitemAttachmentByKey: {},
    subitemProgressByKey: {},
    subitemTimelineByKey: {},
    subitemNotesByKey: {},
    subitemPicByKey: {},
    detailRowsByStage: {},
    detailNameByKey: {},
    removedDetailStepsByStage: {},
    customStagesByTender: {},
  });
  const pendingRef = useRef(new Set());

  useEffect(() => {
    if (isLoading || hasHydrated) return;
    const { state } = buildSubitemStateFromTenders(tenders);
    setSubitemStatusByKey(state.subitemStatusByKey);
    setSubitemPriorityByKey(state.subitemPriorityByKey);
    setSubitemSubmissionByKey(state.subitemSubmissionByKey);
    setSubitemAttachmentByKey(state.subitemAttachmentByKey);
    setSubitemProgressByKey(state.subitemProgressByKey);
    setDetailRowsByStage(state.detailRowsByStage);
    setDetailNameByKey(state.detailNameByKey);
    setSubitemTimelineByKey(state.subitemTimelineByKey);
    setSubitemNotesByKey(state.subitemNotesByKey);
    setSubitemPicByKey(state.subitemPicByKey);
    setRemovedDetailStepsByStage(state.removedDetailStepsByStage);
    previousRef.current = {
      ...state,
      customStagesByTender,
    };
    setHasHydrated(true);
  }, [customStagesByTender, hasHydrated, isLoading, tenders]);

  useEffect(() => {
    if (!hasHydrated) {
      previousRef.current = {
        subitemStatusByKey,
        subitemPriorityByKey,
        subitemSubmissionByKey,
        subitemAttachmentByKey,
        subitemProgressByKey,
        subitemTimelineByKey,
        subitemNotesByKey,
        subitemPicByKey,
        detailRowsByStage,
        detailNameByKey,
        removedDetailStepsByStage,
        customStagesByTender,
      };
      return;
    }
    if (typeof updateTender !== "function") return;

    const changedTenderIds = new Set();
    const stageChangedIds = new Set();

    collectChangedTenderIds(
      previousRef.current.subitemStatusByKey,
      subitemStatusByKey,
      changedTenderIds,
    );
    collectChangedTenderIds(
      previousRef.current.subitemPriorityByKey,
      subitemPriorityByKey,
      changedTenderIds,
    );
    collectChangedTenderIds(
      previousRef.current.subitemSubmissionByKey,
      subitemSubmissionByKey,
      changedTenderIds,
    );
    collectChangedTenderIds(
      previousRef.current.subitemAttachmentByKey,
      subitemAttachmentByKey,
      changedTenderIds,
    );
    collectChangedTenderIds(
      previousRef.current.subitemProgressByKey,
      subitemProgressByKey,
      changedTenderIds,
    );
    collectChangedTenderIds(
      previousRef.current.subitemTimelineByKey,
      subitemTimelineByKey,
      changedTenderIds,
    );
    collectChangedTenderIds(
      previousRef.current.subitemNotesByKey,
      subitemNotesByKey,
      changedTenderIds,
    );
    collectChangedTenderIds(
      previousRef.current.subitemPicByKey,
      subitemPicByKey,
      changedTenderIds,
    );
    collectChangedTenderIds(
      previousRef.current.detailRowsByStage,
      detailRowsByStage,
      changedTenderIds,
    );
    collectChangedTenderIds(
      previousRef.current.detailNameByKey,
      detailNameByKey,
      changedTenderIds,
    );
    collectChangedTenderIds(
      previousRef.current.removedDetailStepsByStage,
      removedDetailStepsByStage,
      changedTenderIds,
    );
    collectStageChanges(
      previousRef.current.customStagesByTender,
      customStagesByTender,
      stageChangedIds,
    );
    stageChangedIds.forEach((id) => changedTenderIds.add(id));

    const pendingToClear = [];
    pendingRef.current.forEach((tenderId) => {
      const tender = tenders.find((item) => item.id === tenderId);
      if (tender?.createdAt) {
        changedTenderIds.add(tenderId);
        pendingToClear.push(tenderId);
      }
    });

    if (changedTenderIds.size) {
      const maps = {
        subitemStatusByKey,
        subitemPriorityByKey,
        subitemSubmissionByKey,
        subitemAttachmentByKey,
        subitemProgressByKey,
        subitemTimelineByKey,
        subitemNotesByKey,
        subitemPicByKey,
        detailRowsByStage,
        detailNameByKey,
        removedDetailStepsByStage,
      };

      changedTenderIds.forEach((tenderId) => {
        const tender = tenders.find((item) => item.id === tenderId);
        if (!tender || !tender.createdAt) {
          pendingRef.current.add(tenderId);
          return;
        }
        const stages = resolveStagesForTender(tender, customStagesByTender);
        const subitems = buildSubitemsPayload({ tender, stages, maps });
        const payload = { subitems, isDraft: false };
        if (stageChangedIds.has(tenderId)) {
          payload.stages = stages;
        }
        updateTender(tenderId, payload);
      });

      pendingToClear.forEach((tenderId) => {
        pendingRef.current.delete(tenderId);
      });
    }

    previousRef.current = {
      subitemStatusByKey,
      subitemPriorityByKey,
      subitemSubmissionByKey,
      subitemAttachmentByKey,
      subitemProgressByKey,
      subitemTimelineByKey,
      subitemNotesByKey,
      subitemPicByKey,
      detailRowsByStage,
      detailNameByKey,
      removedDetailStepsByStage,
      customStagesByTender,
    };
  }, [
    subitemStatusByKey,
    subitemPriorityByKey,
    subitemSubmissionByKey,
    subitemAttachmentByKey,
    subitemProgressByKey,
    subitemTimelineByKey,
    subitemNotesByKey,
    subitemPicByKey,
    detailRowsByStage,
    detailNameByKey,
    removedDetailStepsByStage,
    customStagesByTender,
    hasHydrated,
    updateTender,
    tenders,
  ]);

  const handleSubitemStatusChange = (key, value) => {
    setSubitemStatusByKey((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubitemPriorityChange = (key, value) => {
    setSubitemPriorityByKey((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubitemSubmissionChange = (key, value) => {
    setSubitemSubmissionByKey((prev) => {
      const next = { ...prev };
      if (value) {
        next[key] = value;
      } else {
        delete next[key];
      }
      return next;
    });
  };

  const handleSubitemProgressChange = (key, value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return;
    const safe = Math.max(0, Math.min(100, numeric));
    setSubitemProgressByKey((prev) => ({
      ...prev,
      [key]: safe,
    }));
    if (safe >= 100) {
      setSubitemStatusByKey((prev) => ({
        ...prev,
        [key]: "Done",
      }));
      return;
    }
    if (safe > 0) {
      setSubitemStatusByKey((prev) => {
        const current = prev[key] || "Not Started";
        if (current !== "Not Started") return prev;
        return { ...prev, [key]: "On Progress" };
      });
    }
  };

  const addAttachmentForKey = (key, attachment, fallback = []) => {
    if (!attachment) return;
    setSubitemAttachmentByKey((prev) => {
      const current = normalizeAttachmentList(prev[key] ?? fallback);
      const nextAttachment = normalizeAttachmentList(attachment)[0];
      if (!nextAttachment) return prev;
      return {
        ...prev,
        [key]: [...current, nextAttachment],
      };
    });
  };

  const removeAttachmentForKey = (key, index, fallback = []) => {
    setSubitemAttachmentByKey((prev) => {
      const current = normalizeAttachmentList(prev[key] ?? fallback);
      const nextList = current.filter((_, itemIndex) => itemIndex !== index);
      const next = { ...prev };
      next[key] = nextList;
      return next;
    });
  };

  return {
    subitemStatusByKey,
    setSubitemStatusByKey,
    subitemPriorityByKey,
    setSubitemPriorityByKey,
    subitemSubmissionByKey,
    setSubitemSubmissionByKey,
    subitemAttachmentByKey,
    setSubitemAttachmentByKey,
    subitemProgressByKey,
    setSubitemProgressByKey,
    detailRowsByStage,
    setDetailRowsByStage,
    detailNameByKey,
    setDetailNameByKey,
    subitemTimelineByKey,
    setSubitemTimelineByKey,
    subitemNotesByKey,
    setSubitemNotesByKey,
    subitemPicByKey,
    setSubitemPicByKey,
    removedDetailStepsByStage,
    setRemovedDetailStepsByStage,
    handleSubitemStatusChange,
    handleSubitemPriorityChange,
    handleSubitemSubmissionChange,
    handleSubitemProgressChange,
    addAttachmentForKey,
    removeAttachmentForKey,
  };
};

export default useSubitemState;
