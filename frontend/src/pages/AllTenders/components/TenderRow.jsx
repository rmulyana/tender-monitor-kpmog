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

  const rowClassName = tenderRowClass({
    isOverdue: timelineOverdueDays > 0,
    isArchived,
  });

  return (
    <Fragment>
      <tr className={rowClassName} data-row-id={tender.id}>
        <td className="w-pin sticky">
          <div className="pin-cell">
            <span className="pin-text">{tender.pin}</span>
            <button
              className={`exp-btn exp-btn-main${isExpanded ? " is-open" : ""}`}
              type="button"
              aria-label="Toggle details"
              aria-expanded={isExpanded}
              aria-controls={`subitems-${tender.id}`}
              onClick={() => togglePin(tender.id)}
            >
              <svg
                className="chev chev-main"
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
        <td className="w-title sticky2 divider-shadow wraptext">
          <div className="title-cell">
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
        <td className="w-client wraptext">
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
        <td className="w-cons wraptext">
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
        <td className="w-loc wraptext">
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
        <td className="nowrap">
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
        <td className="w-stage">
          <MainStageSelect
            value={mainStage}
            onChange={(event) =>
              handleMainStageChange(tender.id, event.target.value)
            }
            onBlur={(event) => maybeRemoveDraft(tender.id, {}, event)}
            isLocked={isFailedOverride}
          />
        </td>
        <td className="w-status">
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
        <td className="w-timeline">
          {renderEditableTimelineCell(
            tender.id,
            displayTender.startDate,
            displayTender.dueDate,
            timelineOverdueDays,
            true,
          )}
        </td>
        <td className="w-remarks wraptext">
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
