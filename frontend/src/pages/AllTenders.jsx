import { useEffect, useMemo, useState } from "react";
import TendersTable from "./AllTenders/components/TendersTable.jsx";
import TenderFilters from "./AllTenders/components/TenderFilters.jsx";
import AttachmentMenu from "./AllTenders/components/AttachmentMenu.jsx";
import TenderCards from "./AllTenders/components/TenderCards.jsx";
import TenderDialogs from "./AllTenders/components/TenderDialogs.jsx";
import TimelinePopover from "./AllTenders/components/TimelinePopover.jsx";
import useRenderers from "./AllTenders/hooks/useRenderers.js";
import useAttachmentMenu from "./AllTenders/hooks/useAttachmentMenu.js";
import useTenderEdits from "./AllTenders/hooks/useTenderEdits.js";
import useTimelinePopover from "./AllTenders/hooks/useTimelinePopover.js";
import useSubitemState from "./AllTenders/hooks/useSubitemState.js";
import useAttachmentActions from "./AllTenders/hooks/useAttachmentActions.js";
import useAutoTimelineSync from "./AllTenders/hooks/useAutoTimelineSync.js";
import useTenderEditsController from "./AllTenders/hooks/useTenderEditsController.js";
import useStageManager from "./AllTenders/hooks/useStageManager.js";
import useTenderRowActions from "./AllTenders/hooks/useTenderRowActions.js";
import useTenderListActions from "./AllTenders/hooks/useTenderListActions.jsx";
import useDetailRowActions from "./AllTenders/hooks/useDetailRowActions.jsx";
import useMainStageStatus from "./AllTenders/hooks/useMainStageStatus.jsx";
import useTenderExpansionState from "./AllTenders/hooks/useTenderExpansionState.jsx";
import {
  nextPinForTenders,
  picCell,
  progressColor,
} from "./AllTenders/tenderHelpers.jsx";
import useAllTendersState from "./AllTenders/hooks/useAllTendersState.jsx";
import {
  normalizeDateInput,
  normalizeDateTimeInput,
  overdueDays,
} from "../utils/timeline.js";
import { matchesYearFilter } from "../utils/tenderUtils.js";
import { getMaxDetailIndexFromRows } from "../utils/subitemsMapper.js";
import exportTendersCsv from "../utils/exportTendersCsv.js";

const AllTenders = () => {
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
    editingPicKey,
    setEditingPicKey,
    picDraft,
    setPicDraft,
    editedRows,
    setEditedRows,
    detailIdRef,
  } = useAllTendersState();

  const [customStagesByTender, setCustomStagesByTender] = useState({});

  const {
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
    removedDetailStepsByStage,
    setRemovedDetailStepsByStage,
  } = useSubitemState({
    tenders: allTenders,
    customStagesByTender,
    updateTender,
    isLoading,
  });

  const {
    mainStageById,
    setMainStageById,
    mainStatusById,
    setMainStatusById,
    handleMainStageChange,
    handleMainStatusChange,
    getMainStatusOptions,
  } = useMainStageStatus({ updateTender, subitemStatusByKey });

  const {
    confirmAttachment,
    setConfirmAttachment,
    openAttachmentInNewTab,
    getPopoverAttachments,
    handleAttachmentRemoveRequest,
    confirmAttachmentDelete,
  } = useAttachmentActions({
    subitemAttachmentByKey,
    removeAttachmentForKey,
  });

  const {
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
  } = useTenderEdits();

  const {
    expandedStages,
    setExpandedStages,
    stagePickerForTender,
    stagePickerValue,
    setStagePickerValue,
    setStagePickerForTender,
    toggleStage,
    handleAddStage,
    openStagePicker,
    handleDeleteStageRow,
  } = useStageManager({
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
    customStagesByTender,
    setCustomStagesByTender,
  });

  const {
    attachmentMenu,
    attachmentTab,
    attachmentLinkDraft,
    attachmentMenuRef,
    attachmentFileInputRef,
    openAttachmentMenu,
    closeAttachmentMenu,
    setAttachmentTab,
    setAttachmentLinkDraft,
    handleAttachmentFileChange,
    handleAttachmentLinkSave,
  } = useAttachmentMenu({ addAttachmentForKey });

  const { expandedPin, setExpandedPin, togglePin } = useTenderExpansionState({
    setExpandedStages,
    setStagePickerForTender,
    setStagePickerValue,
    closeAttachmentMenu,
  });

  const { handleAddTender, renderSortableHeader } = useTenderListActions({
    allTenders,
    addTender,
    beginEditCell,
    getMainStatusOptions,
    nextPinForTenders,
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
  });

  const { handleAddDetailRow, handleDeleteDetailRow, handleDeleteDetailStep } =
    useDetailRowActions({
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
    });


  const {
    cleanupDraftTender,
    handleDeleteTender,
    handleArchiveTender,
    handleRestoreTender,
    handleDuplicateTender,
  } = useTenderRowActions({
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
      nextPinForTenders,
      overdueDays,
    });

  useAutoTimelineSync({
    tenders,
    customStagesByTender,
    detailRowsByStage,
    subitemTimelineByKey,
    setSubitemTimelineByKey,
    setEditedRows,
  });

  useEffect(() => {
    const maxIndex = getMaxDetailIndexFromRows(detailRowsByStage);
    if (Number.isFinite(maxIndex) && maxIndex >= detailIdRef.current) {
      detailIdRef.current = maxIndex + 1;
    }
  }, [detailRowsByStage, detailIdRef]);

  const {
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
  } = useTenderEditsController({
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
  });

  const { timelineMenu, timelineMenuRef, openTimelineMenu } =
    useTimelinePopover({
      editDraftStart,
      editDraftDue,
      setEditDraftStart,
      setEditDraftDue,
      normalizeDateInput,
      normalizeDateTimeInput,
      commitTimeline,
      commitSubitemTimeline,
      maybeRemoveDraft,
      cancelEditCell,
      setEditingCell,
    });

  const renderers = useRenderers({
    editingCell,
    editDraft,
    setEditDraft,
    editDraftCurrency,
    setEditDraftCurrency,
    beginEditCell,
    commitEditCell,
    cancelEditCell,
    beginEditEstValue,
    commitEstValue,
    maybeRemoveDraft,
    beginEditSubitemNotes,
    commitSubitemNotes,
    beginEditDetailName,
    commitDetailName,
    beginEditDetailSubmission,
    commitDetailSubmission,
    subitemSubmissionByKey,
    handleSubitemSubmissionChange,
    subitemProgressByKey,
    handleSubitemProgressChange,
    progressColor,
    subitemAttachmentByKey,
    openAttachmentMenu,
    subitemPicByKey,
    editingPicKey,
    picDraft,
    setPicDraft,
    beginEditPic,
    commitPic,
    cancelPicEdit,
    picCell,
    openTimelineMenu,
    overdueDays,
  });

  const handleExportMain = () => {
    exportTendersCsv({
      tenders,
      editedRows,
      mainStageById,
      mainStatusById,
      customStagesByTender,
      subitemStatusByKey,
      subitemPriorityByKey,
      subitemSubmissionByKey,
      subitemTimelineByKey,
      subitemNotesByKey,
      subitemPicByKey,
      subitemProgressByKey,
      mode: "main",
    });
  };

  const handleExportAll = () => {
    exportTendersCsv({
      tenders,
      editedRows,
      mainStageById,
      mainStatusById,
      customStagesByTender,
      subitemStatusByKey,
      subitemPriorityByKey,
      subitemSubmissionByKey,
      subitemTimelineByKey,
      subitemNotesByKey,
      subitemPicByKey,
      subitemProgressByKey,
      mode: "all",
    });
  };

  const popoverAttachments = getPopoverAttachments(attachmentMenu);
  const filterSourceTenders = useMemo(() => {
    return allTenders.filter((tender) => {
      if (archivedFilter !== "show" && tender.archived) {
        return false;
      }
      return matchesYearFilter(tender, selectedYear);
    });
  }, [allTenders, archivedFilter, selectedYear]);

  return (
    <div className="grid gap-6">
      <TenderFilters
        allTenders={filterSourceTenders}
        search={search}
        onSearchChange={setSearch}
        stageFilter={stageFilter}
        onStageFilterChange={setStageFilter}
      statusFilter={statusFilter}
      onStatusFilterChange={setStatusFilter}
      monthFilter={monthFilter}
      onMonthFilterChange={setMonthFilter}
      archivedFilter={archivedFilter}
      onArchivedFilterChange={setArchivedFilter}
      setSortKey={setSortKey}
      setSortDirection={setSortDirection}
      onExportMain={handleExportMain}
      onExportAll={handleExportAll}
    />

      <TendersTable
        tenders={tenders}
        allTenders={allTenders}
        editedRows={editedRows}
        expandedPin={expandedPin}
        expandedStages={expandedStages}
        customStagesByTender={customStagesByTender}
        stagePickerForTender={stagePickerForTender}
        stagePickerValue={stagePickerValue}
        mainStageById={mainStageById}
        mainStatusById={mainStatusById}
        subitemStatusByKey={subitemStatusByKey}
        subitemPriorityByKey={subitemPriorityByKey}
        subitemSubmissionByKey={subitemSubmissionByKey}
        subitemTimelineByKey={subitemTimelineByKey}
        subitemNotesByKey={subitemNotesByKey}
        detailRowsByStage={detailRowsByStage}
        detailNameByKey={detailNameByKey}
        removedDetailStepsByStage={removedDetailStepsByStage}
        renderSortableHeader={renderSortableHeader}
        renderers={renderers}
        togglePin={togglePin}
        toggleStage={toggleStage}
        openStagePicker={openStagePicker}
        handleAddStage={handleAddStage}
        handleAddDetailRow={handleAddDetailRow}
        onArchive={handleArchiveTender}
        onDeleteTender={handleDeleteTender}
        onDeleteDetailRow={handleDeleteDetailRow}
        onDeleteDetailStep={handleDeleteDetailStep}
        onDeleteStageRow={handleDeleteStageRow}
        onRestore={handleRestoreTender}
        handleMainStageChange={handleMainStageChange}
        handleMainStatusChange={handleMainStatusChange}
        handleSubitemStatusChange={handleSubitemStatusChange}
        handleSubitemPriorityChange={handleSubitemPriorityChange}
        maybeRemoveDraft={maybeRemoveDraft}
        overdueDays={overdueDays}
        setStagePickerForTender={setStagePickerForTender}
        setStagePickerValue={setStagePickerValue}
        onDuplicate={handleDuplicateTender}
        handleAddTender={handleAddTender}
      />

      <TimelinePopover
        menu={timelineMenu}
        menuRef={timelineMenuRef}
        editDraftStart={editDraftStart}
        editDraftDue={editDraftDue}
        setEditDraftStart={setEditDraftStart}
        setEditDraftDue={setEditDraftDue}
      />

      <AttachmentMenu
        menu={attachmentMenu}
        attachments={popoverAttachments}
        tab={attachmentTab}
        onTabChange={setAttachmentTab}
        linkDraft={attachmentLinkDraft}
        onLinkDraftChange={setAttachmentLinkDraft}
        onOpenAttachment={openAttachmentInNewTab}
        onRequestRemove={(index) =>
          handleAttachmentRemoveRequest(attachmentMenu, popoverAttachments, index)
        }
        onChooseFile={() => attachmentFileInputRef.current?.click()}
        onFileChange={handleAttachmentFileChange}
        onLinkSave={handleAttachmentLinkSave}
        menuRef={attachmentMenuRef}
        fileInputRef={attachmentFileInputRef}
      />

      <TenderDialogs
        confirmAttachment={confirmAttachment}
        onConfirmAttachmentDelete={confirmAttachmentDelete}
        onCancelAttachment={() => setConfirmAttachment(null)}
      />

      <div className="mt-6 block lg:hidden">
        <TenderCards tenders={tenders} />
      </div>
    </div>
  );
};

export default AllTenders;
