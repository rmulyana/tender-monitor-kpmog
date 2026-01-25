import { useState } from "react";

import { normalizeAttachmentList } from "../../../utils/tenderUtils.js";

const useSubitemState = () => {
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
      return {
        ...prev,
        [key]: [...current, attachment],
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
    handleSubitemStatusChange,
    handleSubitemPriorityChange,
    handleSubitemSubmissionChange,
    handleSubitemProgressChange,
    addAttachmentForKey,
    removeAttachmentForKey,
  };
};

export default useSubitemState;
