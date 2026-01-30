import { Fragment } from "react";

import { tenderRowClass } from "../../../utils/rowClassNames.js";
import MainStageSelect from "./MainStageSelect.jsx";
import MainStatusSelect from "./MainStatusSelect.jsx";
import RowMenuTrigger from "./RowMenuTrigger.jsx";
import SubitemBlock from "./SubitemBlock.jsx";
import useTenderRowState from "../hooks/useTenderRowState.js";

const TenderRow = ({
  tender,
  editedRows,
  expandedPin,
  expandedStages,
  customStagesByTender,
  stagePickerForTender,
  stagePickerValue,
  openMenuId,
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
  renderers,
  togglePin,
  toggleStage,
  openStagePicker,
  handleAddStage,
  handleAddDetailRow,
  onRequestDetailDelete,
  onRequestStepDelete,
  onRequestStageDelete,
  handleMainStageChange,
  handleMainStatusChange,
  handleSubitemStatusChange,
  handleSubitemPriorityChange,
  maybeRemoveDraft,
  overdueDays,
  setStagePickerForTender,
  setStagePickerValue,
  onToggleMenu,
}) => {
  const {
    renderEditableCell,
    renderEditableTextArea,
    renderEditableEstValueCell,
    renderEditableTimelineCell,
    renderEditableSubitemTimelineCell,
    renderEditableSubitemNotes,
    renderSubmissionSelect,
    renderProgressSlider,
    renderEditableDetailName,
    renderEditableDetailSubmission,
    renderAttachmentCell,
    renderPicField,
  } = renderers;
  const {
    displayTender,
    displayEstValue,
    editEstValue,
    mainStage,
    statusOptions,
    mainStatus,
    isFailedOverride,
    timelineOverdueDays,
  } = useTenderRowState({
    tender,
    editedRows,
    mainStageById,
    mainStatusById,
    subitemStatusByKey,
    overdueDays,
  });
  const isExpanded = expandedPin === tender.id;
  const isArchived = Boolean(tender.archived);
  const stickyBgClass = timelineOverdueDays > 0 ? "bg-amber-50/50" : "bg-white";

  const rowClassName = tenderRowClass({
    isOverdue: timelineOverdueDays > 0,
    isArchived,
  });

  return (
    <Fragment>
      <tr className={rowClassName} data-row-id={tender.id}>
        <td
          className={`sticky left-0 z-30 w-[72px] min-w-[72px] max-w-[72px] px-3 py-3 align-top group-hover:bg-orange-200/20 ${stickyBgClass} relative`}
        >
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-1 bg-orange-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">
              {tender.pin}
            </span>
            <button
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 ${isExpanded ? "rotate-180" : ""}`}
              type="button"
              aria-label="Toggle details"
              aria-expanded={isExpanded}
              aria-controls={`subitems-${tender.id}`}
              onClick={() => togglePin(tender.id)}
            >
              <svg
                className="h-2.5 w-2.5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M7 10l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </td>
        <td
          className={`sticky left-[72px] z-20 w-[260px] min-w-[260px] max-w-[260px] px-3 py-3 align-top group-hover:bg-orange-200/20 ${stickyBgClass}`}
        >
          <div className="flex items-start gap-2">
            {renderEditableCell(
              tender.id,
              "projectTitle",
              displayTender.projectTitle,
              "title-link",
              displayTender.projectTitle,
              displayTender.projectTitle,
              "Add title",
            )}
            <RowMenuTrigger
              tenderId={tender.id}
              openMenuId={openMenuId}
              onToggleMenu={onToggleMenu}
            />
          </div>
        </td>
        <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-3 align-top">
          {renderEditableCell(
            tender.id,
            "client",
            displayTender.client,
            "",
            displayTender.client,
            displayTender.client,
            "Add client",
            true,
          )}
        </td>
        <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-3 align-top">
          {renderEditableCell(
            tender.id,
            "consortium",
            displayTender.consortium,
            "",
            displayTender.consortium,
            displayTender.consortium,
            "Add partner",
            true,
          )}
        </td>
        <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-3 align-top">
          {renderEditableCell(
            tender.id,
            "location",
            displayTender.location,
            "",
            displayTender.location,
            displayTender.location,
            "Add location",
            true,
          )}
        </td>
        <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-3 align-top whitespace-nowrap">
          {renderEditableEstValueCell(
            tender.id,
            displayEstValue,
            displayTender.estValue,
            displayTender.currency,
            editEstValue,
            "Add value",
            true,
          )}
        </td>
        <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-3 align-top">
          <MainStageSelect
            value={mainStage}
            onChange={(event) =>
              handleMainStageChange(tender.id, event.target.value)
            }
            onBlur={(event) => maybeRemoveDraft(tender.id, {}, event)}
            isLocked={isFailedOverride}
          />
        </td>
        <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-3 align-top">
          <MainStatusSelect
            value={mainStatus}
            statusOptions={statusOptions}
            onChange={(event) =>
              handleMainStatusChange(tender.id, event.target.value)
            }
            onBlur={(event) => maybeRemoveDraft(tender.id, {}, event)}
            isLocked={isFailedOverride}
          />
        </td>
        <td className="w-[200px] min-w-[200px] max-w-[200px] px-3 py-3 align-top">
          {renderEditableTimelineCell(
            tender.id,
            displayTender.startDate,
            displayTender.dueDate,
            timelineOverdueDays,
            true,
          )}
        </td>
        <td className="w-[170px] min-w-[170px] max-w-[170px] px-3 py-3 align-top">
          {renderEditableTextArea(
            tender.id,
            "remarks",
            displayTender.remarks,
            "Add remarks",
            true,
          )}
        </td>
      </tr>
      <SubitemBlock
        tender={tender}
        isExpanded={isExpanded}
        expandedStages={expandedStages}
        toggleStage={toggleStage}
        stagePickerForTender={stagePickerForTender}
        stagePickerValue={stagePickerValue}
        setStagePickerValue={setStagePickerValue}
        setStagePickerForTender={setStagePickerForTender}
        customStagesByTender={customStagesByTender}
        openStagePicker={openStagePicker}
        handleAddStage={handleAddStage}
        handleAddDetailRow={handleAddDetailRow}
        onRequestDetailDelete={onRequestDetailDelete}
        onRequestStepDelete={onRequestStepDelete}
        onRequestStageDelete={onRequestStageDelete}
        subitemStatusByKey={subitemStatusByKey}
        subitemPriorityByKey={subitemPriorityByKey}
        subitemSubmissionByKey={subitemSubmissionByKey}
        subitemTimelineByKey={subitemTimelineByKey}
        subitemNotesByKey={subitemNotesByKey}
        detailRowsByStage={detailRowsByStage}
        detailNameByKey={detailNameByKey}
        removedDetailStepsByStage={removedDetailStepsByStage}
        renderers={renderers}
        handleSubitemStatusChange={handleSubitemStatusChange}
        handleSubitemPriorityChange={handleSubitemPriorityChange}
      />
    </Fragment>
  );
};

export default TenderRow;
