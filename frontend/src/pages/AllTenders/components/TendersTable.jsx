import AddItemRow from "./AddItemRow.jsx";
import RowMenuDropdown from "./RowMenuDropdown.jsx";
import TableHeaderRow from "./TableHeaderRow.jsx";
import TenderRow from "./TenderRow.jsx";
import TenderDialogs from "./TenderDialogs.jsx";
import useRowMenuState from "../hooks/useRowMenuState.js";
import useConfirmDelete from "../hooks/useConfirmDelete.js";

const TendersTable = ({
  tenders,
  allTenders,
  editedRows,
  expandedPin,
  expandedStages,
  customStagesByTender,
  stagePickerForTender,
  stagePickerValue,
  mainStageById,
  mainStatusById,
  subitemStatusByKey,
  subitemPriorityByKey,
  subitemSubmissionByKey,
  subitemTimelineByKey,
  subitemNotesByKey,
  detailRowsByStage,
  detailNameByKey,
  removedDetailStepsByStage,
  renderSortableHeader,
  renderers,
  togglePin,
  toggleStage,
  openStagePicker,
  handleAddStage,
  handleAddDetailRow,
  handleMainStageChange,
  handleMainStatusChange,
  handleSubitemStatusChange,
  handleSubitemPriorityChange,
  maybeRemoveDraft,
  overdueDays,
  setStagePickerForTender,
  setStagePickerValue,
  onDuplicate,
  onArchive,
  onRestore,
  onDeleteTender,
  onDeleteDetailRow,
  onDeleteDetailStep,
  onDeleteStageRow,
  handleAddTender,
}) => {
  const { openMenuId, menuPosition, menuRef, toggleMenu, closeMenu } =
    useRowMenuState();
  const {
    confirmDeleteId,
    setConfirmDeleteId,
    confirmSubitemDelete,
    setConfirmSubitemDelete,
    confirmDeleteTender,
    confirmSubitemDeleteAction,
  } = useConfirmDelete({
    handleDeleteTender: onDeleteTender,
    handleDeleteDetailRow: onDeleteDetailRow,
    handleDeleteDetailStep: onDeleteDetailStep,
    handleDeleteStageRow: onDeleteStageRow,
  });

  return (
    <section className="table-card">
      <div className="table-scroll">
        <table className="tenders-table">
          <thead>
            <TableHeaderRow renderSortableHeader={renderSortableHeader} />
          </thead>
          <tbody>
            {tenders.map((tender) => (
              <TenderRow
                key={tender.id}
                tender={tender}
                editedRows={editedRows}
                expandedPin={expandedPin}
                expandedStages={expandedStages}
                customStagesByTender={customStagesByTender}
                stagePickerForTender={stagePickerForTender}
                stagePickerValue={stagePickerValue}
                openMenuId={openMenuId}
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
                renderers={renderers}
                togglePin={togglePin}
                toggleStage={toggleStage}
                openStagePicker={openStagePicker}
                handleAddStage={handleAddStage}
                handleAddDetailRow={handleAddDetailRow}
                onRequestDetailDelete={(stageKey, detailKey) =>
                  setConfirmSubitemDelete({
                    type: "detail",
                    stageKey,
                    detailKey,
                  })
                }
                onRequestStepDelete={(stageKey, stepName) =>
                  setConfirmSubitemDelete({
                    type: "step",
                    stageKey,
                    stepName,
                  })
                }
                onRequestStageDelete={(tenderId, stageName, stageList) =>
                  setConfirmSubitemDelete({
                    type: "stage",
                    tenderId,
                    stageName,
                    stageList,
                  })
                }
                handleMainStageChange={handleMainStageChange}
                handleMainStatusChange={handleMainStatusChange}
                handleSubitemStatusChange={handleSubitemStatusChange}
                handleSubitemPriorityChange={handleSubitemPriorityChange}
                maybeRemoveDraft={maybeRemoveDraft}
                overdueDays={overdueDays}
                setStagePickerForTender={setStagePickerForTender}
                setStagePickerValue={setStagePickerValue}
                onToggleMenu={toggleMenu}
              />
            ))}
            <AddItemRow onAdd={handleAddTender} />
          </tbody>
        </table>
        <RowMenuDropdown
          openMenuId={openMenuId}
          menuPosition={menuPosition}
          menuRef={menuRef}
          tenders={tenders}
          allTenders={allTenders}
          onDuplicate={onDuplicate}
          onArchive={onArchive}
          onRestore={onRestore}
          onRequestDelete={(id) => setConfirmDeleteId(id)}
          onClose={closeMenu}
        />
        <TenderDialogs
          confirmDeleteId={confirmDeleteId}
          onConfirmDelete={confirmDeleteTender}
          onCancelDelete={() => setConfirmDeleteId(null)}
          confirmSubitemDelete={confirmSubitemDelete}
          onConfirmSubitemDelete={confirmSubitemDeleteAction}
          onCancelSubitemDelete={() => setConfirmSubitemDelete(null)}
        />
        {tenders.length === 0 && (
          <div className="empty-state">
            <h3>No tenders found</h3>
            <p>Try adjusting search or filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TendersTable;
