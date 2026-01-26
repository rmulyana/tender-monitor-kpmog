import { useRef, useState } from "react";

import { useTenders } from "../../../context/TenderContext.jsx";

const useAllTendersState = () => {
  const {
    tenders,
    allTenders,
    selectedYear,
    search,
    setSearch,
    stageFilter,
    setStageFilter,
    statusFilter,
    setStatusFilter,
    monthFilter,
    setMonthFilter,
    archivedFilter,
    setArchivedFilter,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    isLoading,
    addTender,
    updateTender,
    removeTender,
  } = useTenders();

  const [editingPicKey, setEditingPicKey] = useState(null);
  const [picDraft, setPicDraft] = useState("");
  const [editedRows, setEditedRows] = useState({});
  const detailIdRef = useRef(0);

  return {
    tenders,
    allTenders,
    selectedYear,
    search,
    setSearch,
    stageFilter,
    setStageFilter,
    statusFilter,
    setStatusFilter,
    monthFilter,
    setMonthFilter,
    archivedFilter,
    setArchivedFilter,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    isLoading,
    addTender,
    updateTender,
    removeTender,
    editingPicKey,
    setEditingPicKey,
    picDraft,
    setPicDraft,
    editedRows,
    setEditedRows,
    detailIdRef,
  };
};

export default useAllTendersState;
