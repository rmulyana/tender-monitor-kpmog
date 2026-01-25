import { useState } from "react";

const resetOtherDrafts = (
  setEditDraftCurrency,
  setEditDraftStart,
  setEditDraftDue,
) => {
  setEditDraftCurrency("");
  setEditDraftStart("");
  setEditDraftDue("");
};

const useTenderEdits = () => {
  const [editingCell, setEditingCell] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [editDraftCurrency, setEditDraftCurrency] = useState("");
  const [editDraftStart, setEditDraftStart] = useState("");
  const [editDraftDue, setEditDraftDue] = useState("");

  const beginEditCell = (id, field, value) => {
    setEditingCell({ id, field });
    setEditDraft(value ?? "");
    resetOtherDrafts(
      setEditDraftCurrency,
      setEditDraftStart,
      setEditDraftDue,
    );
  };

  const beginEditEstValue = (id, value, currency) => {
    setEditingCell({ id, field: "estValue" });
    setEditDraft(value ?? "");
    setEditDraftCurrency(currency || "IDR");
    setEditDraftStart("");
    setEditDraftDue("");
  };

  const beginEditSubitemNotes = (key, value) => {
    beginEditCell(key, "subitemNotes", value);
  };

  const beginEditDetailName = (key, value) => {
    beginEditCell(key, "detailName", value);
  };

  const beginEditDetailSubmission = (key, value) => {
    beginEditCell(key, "detailSubmission", value);
  };

  const cancelEditCell = () => {
    setEditingCell(null);
    setEditDraft("");
    resetOtherDrafts(
      setEditDraftCurrency,
      setEditDraftStart,
      setEditDraftDue,
    );
  };

  return {
    editingCell,
    editDraft,
    editDraftCurrency,
    editDraftStart,
    editDraftDue,
    setEditingCell,
    setEditDraft,
    setEditDraftCurrency,
    setEditDraftStart,
    setEditDraftDue,
    beginEditCell,
    beginEditEstValue,
    beginEditSubitemNotes,
    beginEditDetailName,
    beginEditDetailSubmission,
    cancelEditCell,
  };
};

export default useTenderEdits;
