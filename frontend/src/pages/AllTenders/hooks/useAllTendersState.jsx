import { useRef, useState } from "react";

import { useTenders } from "../../../context/TenderContext.jsx";

const useAllTendersState = () => {
  const {
    tenders,
    allTenders,
    search,
    setSearch,
    stageFilter,
    setStageFilter,
    statusFilter,
    setStatusFilter,
    monthFilter,
    setMonthFilter,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    addTender,
    removeTender,
  } = useTenders();

  const [editingPicKey, setEditingPicKey] = useState(null);
  const [picDraft, setPicDraft] = useState("");
  const [editedRows, setEditedRows] = useState({});
  const [removedDetailStepsByStage, setRemovedDetailStepsByStage] = useState({});
  const detailIdRef = useRef(0);

  return {
    tenders,
    allTenders,
    search,
    setSearch,
    stageFilter,
    setStageFilter,
    statusFilter,
    setStatusFilter,
    monthFilter,
    setMonthFilter,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    addTender,
    removeTender,
    editingPicKey,
    setEditingPicKey,
    picDraft,
    setPicDraft,
    editedRows,
    setEditedRows,
    removedDetailStepsByStage,
    setRemovedDetailStepsByStage,
    detailIdRef,
  };
};

export default useAllTendersState;
