import { overdueDays as computeOverdueDays } from "../../../utils/timeline.js";

const useTenderEditsController = ({
  allTenders,
  editedRows,
  mainStageById,
  mainStatusById,
  updateTender,
  cleanupDraftTender,
  editDraft,
  editDraftCurrency,
  editDraftStart,
  editDraftDue,
  setEditedRows,
  setSubitemNotesByKey,
  setDetailNameByKey,
  setSubitemSubmissionByKey,
  setSubitemTimelineByKey,
  setSubitemPicByKey,
  setEditingPicKey,
  setPicDraft,
  subitemPicByKey,
  editingPicKey,
  cancelEditCell,
  normalizeDateInput,
  normalizeDateTimeInput,
}) => {
  const parseEstValue = (rawValue) => {
    const digits = String(rawValue ?? "").replace(/\D/g, "");
    return digits ? Number(digits) : Number.NaN;
  };

  const maybeRemoveDraft = (id, overridesUpdate = {}, event) => {
    const tender = allTenders.find((item) => item.id === id);
    if (!tender?.isDraft) return;
    if (
      event?.relatedTarget &&
      event.relatedTarget.closest(`[data-row-id="${id}"]`)
    ) {
      return;
    }

    const overrides = { ...(editedRows[id] ?? {}), ...overridesUpdate };
    const merged = { ...tender, ...overrides };
    const hasText = [
      "projectTitle",
      "client",
      "consortium",
      "location",
      "remarks",
    ].some((key) => String(merged[key] || "").trim() !== "");
    const hasValue = Number(merged.estValue) > 0;
    const hasCurrencyChange =
      "currency" in overrides && overrides.currency !== tender.currency;
    const hasTimelineChange =
      "startDate" in overrides || "dueDate" in overrides;
    const hasStageChange = Boolean(mainStageById[id]);
    const hasStatusChange = Boolean(mainStatusById[id]);

    if (
      hasText ||
      hasValue ||
      hasCurrencyChange ||
      hasTimelineChange ||
      hasStageChange ||
      hasStatusChange
    ) {
      return;
    }

    cleanupDraftTender(id);
  };

  const commitEditCell = (id, field, fallback) => {
    const trimmed = String(editDraft ?? "").trim();
    let nextValue = trimmed || fallback;
    setEditedRows((prev) => {
      const existing = prev[id] ?? {};
      const next = { ...prev };

      if (field === "estValue") {
        const numeric = parseEstValue(trimmed);
        nextValue = Number.isFinite(numeric) ? numeric : fallback;
        next[id] = {
          ...existing,
          estValue: nextValue,
        };
      } else {
        next[id] = {
          ...existing,
          [field]: nextValue,
        };
      }

      return next;
    });
    if (updateTender) {
      const payload =
        field === "estValue" ? { estValue: nextValue } : { [field]: nextValue };
      updateTender(id, { ...payload, isDraft: false });
    }
    cancelEditCell();
  };

  const commitEstValue = (id, fallbackValue, fallbackCurrency) => {
    const trimmed = String(editDraft ?? "").trim();
    const numeric = parseEstValue(trimmed);
    const nextCurrency = editDraftCurrency || fallbackCurrency;
    const nextValue = Number.isFinite(numeric) ? numeric : fallbackValue;

    setEditedRows((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {}),
        estValue: nextValue,
        currency: nextCurrency,
      },
    }));
    if (updateTender) {
      updateTender(id, {
        estValue: nextValue,
        currency: nextCurrency,
        isDraft: false,
      });
    }
    cancelEditCell();
  };

  const commitTimeline = (id, fallbackStart, fallbackDue) => {
    const startValue = editDraftStart || normalizeDateInput(fallbackStart);
    const dueValue = editDraftDue || normalizeDateTimeInput(fallbackDue);

    setEditedRows((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? {}),
        startDate: startValue,
        dueDate: dueValue,
      },
    }));
    if (updateTender) {
      const nextOverdueDays = computeOverdueDays(dueValue);
      updateTender(id, {
        startDate: startValue,
        dueDate: dueValue,
        overdueDays: nextOverdueDays,
        isDraft: false,
      });
    }
    cancelEditCell();
  };

  const commitSubitemTimeline = (key, fallbackStart, fallbackDue) => {
    const startValue = editDraftStart || normalizeDateInput(fallbackStart);
    const dueValue = editDraftDue || normalizeDateTimeInput(fallbackDue);
    setSubitemTimelineByKey((prev) => ({
      ...prev,
      [key]: { startDate: startValue, dueDate: dueValue },
    }));
    cancelEditCell();
  };

  const commitSubitemNotes = (key, fallback) => {
    const trimmed = String(editDraft ?? "").trim();
    const nextValue = trimmed || fallback || "";
    setSubitemNotesByKey((prev) => {
      const next = { ...prev };
      if (nextValue) {
        next[key] = nextValue;
      } else {
        delete next[key];
      }
      return next;
    });
    cancelEditCell();
  };

  const commitDetailName = (key, fallback = "") => {
    const trimmed = String(editDraft ?? "").trim();
    const nextValue = trimmed || fallback || "";
    setDetailNameByKey((prev) => {
      const next = { ...prev };
      if (nextValue) {
        next[key] = nextValue;
      } else {
        delete next[key];
      }
      return next;
    });
    cancelEditCell();
  };

  const commitDetailSubmission = (key, fallback = "") => {
    const trimmed = String(editDraft ?? "").trim();
    const nextValue = trimmed || fallback || "";
    setSubitemSubmissionByKey((prev) => {
      const next = { ...prev };
      if (nextValue) {
        next[key] = nextValue;
      } else {
        delete next[key];
      }
      return next;
    });
    cancelEditCell();
  };

  const beginEditPic = (key) => {
    setEditingPicKey(key);
    setPicDraft(subitemPicByKey[key] ?? "");
  };

  const commitPic = (key, value) => {
    if (editingPicKey && editingPicKey !== key) return;
    const trimmed = String(value || "")
      .trim()
      .replace(/\s+/g, " ");
    setSubitemPicByKey((prev) => {
      const next = { ...prev };
      if (trimmed) {
        next[key] = trimmed;
      } else {
        delete next[key];
      }
      return next;
    });
    setEditingPicKey(null);
    setPicDraft("");
  };

  const cancelPicEdit = () => {
    setEditingPicKey(null);
    setPicDraft("");
  };

  return {
    maybeRemoveDraft,
    commitEditCell,
    commitEstValue,
    commitTimeline,
    commitSubitemTimeline,
    commitSubitemNotes,
    commitDetailName,
    commitDetailSubmission,
    beginEditPic,
    commitPic,
    cancelPicEdit,
  };
};

export default useTenderEditsController;
