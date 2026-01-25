import { Fragment } from "react";

import {
  DETAIL_STATUS_OPTIONS,
  STEP_META,
} from "../../../utils/tenderUtils.js";
import SubitemPrioritySelect from "./SubitemPrioritySelect.jsx";
import SubitemStatusSelect from "./SubitemStatusSelect.jsx";
import DetailRow from "./DetailRow.jsx";

const DetailTable = ({
  tenderId,
  stageKey,
  stageName,
  steps,
  detailKeys,
  detailNameByKey,
  removedStepsByStage,
  subitemStatusByKey,
  subitemPriorityByKey,
  subitemSubmissionByKey,
  subitemTimelineByKey,
  subitemNotesByKey,
  renderPicField,
  renderEditableDetailSubmission,
  renderAttachmentCell,
  renderProgressSlider,
  renderEditableSubitemTimelineCell,
  renderEditableSubitemNotes,
  renderEditableDetailName,
  handleSubitemStatusChange,
  handleSubitemPriorityChange,
  onRequestDetailDelete,
  onRequestStepDelete,
  isOpen,
  showAddItem,
  onAddDetailRow,
}) => {
  if (!isOpen) return null;

  const hiddenSteps = removedStepsByStage?.[stageKey] ?? [];
  const visibleSteps = steps.filter((stepName) => !hiddenSteps.includes(stepName));

  return (
    <Fragment>
      {visibleSteps.map((stepName) => {
        const meta = STEP_META[stepName] || {};
        const stepKey = `${stageKey}::${String(stepName)}`;
        const storedStepStatus = subitemStatusByKey[stepKey];
        const stepStatus = DETAIL_STATUS_OPTIONS.includes(storedStepStatus)
          ? storedStepStatus
          : "Not Started";
        return (
          <DetailRow
            key={`${tenderId}-step-${stageName}-${stepName}`}
            className="row-step block"
          >
            <td className="w-pin sticky tree-empty" />
            <td className="w-title sticky2 divider-shadow wraptext tree-box tree-box-first">
              <div className="indent-2 detail-inline">
                <span className="arrow">↳</span>
                <span>{stepName}</span>
                {onRequestStepDelete ? (
                  <button
                    type="button"
                    className="row-delete"
                    aria-label={`Delete ${stepName}`}
                    onClick={() => onRequestStepDelete(stageKey, stepName)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M4 7h16"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10 11v6M14 11v6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                ) : null}
              </div>
            </td>
            <td className="w-client tree-box">
              <SubitemStatusSelect
                value={stepStatus}
                options={DETAIL_STATUS_OPTIONS}
                onChange={(value) => handleSubitemStatusChange(stepKey, value)}
              />
            </td>
            <td className="w-cons tree-box">{renderPicField(stepKey)}</td>
            <td className="w-stage tree-box">
              {renderEditableDetailSubmission(
                stepKey,
                subitemSubmissionByKey[stepKey] ?? meta.submission ?? "",
                "Add submission",
                true,
              )}
            </td>
            <td className="w-status tree-box">
              {renderAttachmentCell(stepKey, meta.attachment)}
            </td>
            <td className="w-date tree-box">
              {renderProgressSlider(stepKey, 0)}
            </td>
            <td className="w-priority tree-box">
              <SubitemPrioritySelect
                value={subitemPriorityByKey[stepKey] ?? ""}
                onChange={(value) =>
                  handleSubitemPriorityChange(stepKey, value)
                }
              />
            </td>
            <td className="w-timeline tree-box">
              {renderEditableSubitemTimelineCell(
                stepKey,
                subitemTimelineByKey[stepKey]?.startDate,
                subitemTimelineByKey[stepKey]?.dueDate,
                true,
              )}
            </td>
            <td className="w-remarks tree-box tree-box-last notes-cell" colSpan={2}>
              {renderEditableSubitemNotes(
                stepKey,
                subitemNotesByKey[stepKey] ?? "",
                "Add notes",
                true,
              )}
            </td>
          </DetailRow>
        );
      })}

      {detailKeys.map((detailKey, index) => {
        const storedDetailStatus = subitemStatusByKey[detailKey];
        const detailStatus = DETAIL_STATUS_OPTIONS.includes(storedDetailStatus)
          ? storedDetailStatus
          : "Not Started";
        return (
          <DetailRow key={`${detailKey}-${index}`} className="row-step block">
            <td className="w-pin sticky tree-empty" />
            <td className="w-title sticky2 divider-shadow wraptext tree-box tree-box-first">
              <div className="indent-2 detail-inline">
                <span className="arrow">↳</span>
                {renderEditableDetailName(
                  detailKey,
                  detailNameByKey[detailKey] ?? "",
                  "Add item",
                )}
                {onRequestDetailDelete ? (
                  <button
                    type="button"
                    className="row-delete"
                    aria-label="Delete detail item"
                    onClick={() => onRequestDetailDelete(stageKey, detailKey)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M4 7h16"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10 11v6M14 11v6"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                ) : null}
              </div>
            </td>
            <td className="w-client tree-box">
              <SubitemStatusSelect
                value={detailStatus}
                options={DETAIL_STATUS_OPTIONS}
                onChange={(value) => handleSubitemStatusChange(detailKey, value)}
              />
            </td>
            <td className="w-cons tree-box">{renderPicField(detailKey)}</td>
            <td className="w-stage tree-box">
              {renderEditableDetailSubmission(
                detailKey,
                subitemSubmissionByKey[detailKey] ?? "",
                "Add submission",
                true,
              )}
            </td>
            <td className="w-status tree-box">
              {renderAttachmentCell(detailKey, "")}
            </td>
            <td className="w-date tree-box">
              {renderProgressSlider(detailKey, 0)}
            </td>
            <td className="w-priority tree-box">
              <SubitemPrioritySelect
                value={subitemPriorityByKey[detailKey] ?? ""}
                onChange={(value) =>
                  handleSubitemPriorityChange(detailKey, value)
                }
              />
            </td>
            <td className="w-timeline tree-box">
              {renderEditableSubitemTimelineCell(
                detailKey,
                subitemTimelineByKey[detailKey]?.startDate,
                subitemTimelineByKey[detailKey]?.dueDate,
                true,
              )}
            </td>
            <td className="w-remarks tree-box tree-box-last notes-cell" colSpan={2}>
              {renderEditableSubitemNotes(
                detailKey,
                subitemNotesByKey[detailKey] ?? "",
                "Add notes",
                true,
              )}
            </td>
          </DetailRow>
        );
      })}

      {showAddItem && (
        <DetailRow
          key={`${tenderId}-add-${stageName}`}
          className="row-step block"
        >
          <td className="w-pin sticky tree-empty" />
          <td className="w-title sticky2 divider-shadow wraptext tree-box tree-box-first">
            <div className="indent-2">
              <button
                type="button"
                className="add-item"
                onClick={onAddDetailRow}
              >
                <span className="add-circle">+</span>
                <span>Add item</span>
              </button>
            </div>
          </td>
          <td className="w-client tree-box" />
          <td className="w-cons tree-box" />
          <td className="w-stage tree-box" />
          <td className="w-status tree-box" />
          <td className="w-date tree-box" />
          <td className="w-priority tree-box" />
          <td className="w-timeline tree-box" />
          <td className="w-remarks tree-box tree-box-last notes-cell" colSpan={2} />
        </DetailRow>
      )}
    </Fragment>
  );
};

export default DetailTable;
