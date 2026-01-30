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
            className="border-b border-slate-200 bg-slate-50/40"
          >
            <td className="sticky left-0 z-30 w-[72px] min-w-[72px] max-w-[72px] bg-slate-50/40 px-3 py-2 group-hover:bg-orange-200/20 relative">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-1 bg-orange-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              />
            </td>
            <td className="sticky left-[72px] z-20 w-[260px] min-w-[260px] max-w-[260px] bg-slate-50/40 px-3 py-2 group-hover:bg-orange-200/20">
              <div className="flex items-center gap-2 pl-6 text-sm text-slate-600">
                <span className="text-slate-400">↳</span>
                <span>{stepName}</span>
                {onRequestStepDelete ? (
                  <button
                    type="button"
                    className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
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
            <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2">
              <SubitemStatusSelect
                value={stepStatus}
                options={DETAIL_STATUS_OPTIONS}
                onChange={(value) => handleSubitemStatusChange(stepKey, value)}
              />
            </td>
            <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-2">
              {renderPicField(stepKey)}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2">
              {renderEditableDetailSubmission(
                stepKey,
                subitemSubmissionByKey[stepKey] ?? meta.submission ?? "",
                "Add submission",
                true,
              )}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2">
              {renderAttachmentCell(stepKey, meta.attachment)}
            </td>
            <td className="w-[100px] min-w-[100px] max-w-[100px] px-3 py-2">
              {renderProgressSlider(stepKey, 0)}
            </td>
            <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-2">
              <SubitemPrioritySelect
                value={subitemPriorityByKey[stepKey] ?? ""}
                onChange={(value) =>
                  handleSubitemPriorityChange(stepKey, value)
                }
              />
            </td>
            <td className="w-[200px] min-w-[200px] max-w-[200px] px-3 py-2">
              {renderEditableSubitemTimelineCell(
                stepKey,
                subitemTimelineByKey[stepKey]?.startDate,
                subitemTimelineByKey[stepKey]?.dueDate,
                true,
              )}
            </td>
            <td className="w-[170px] min-w-[170px] max-w-[170px] px-3 py-2" colSpan={2}>
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
        <DetailRow key={`${detailKey}-${index}`} className="border-b border-slate-200 bg-slate-50/40">
            <td className="sticky left-0 z-30 w-[72px] min-w-[72px] max-w-[72px] bg-slate-50/40 px-3 py-2 group-hover:bg-orange-200/20 relative">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-1 bg-orange-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              />
            </td>
            <td className="sticky left-[72px] z-20 w-[260px] min-w-[260px] max-w-[260px] bg-slate-50/40 px-3 py-2 group-hover:bg-orange-200/20">
              <div className="flex items-center gap-2 pl-6 text-sm text-slate-600">
                <span className="text-slate-400">↳</span>
                {renderEditableDetailName(
                  detailKey,
                  detailNameByKey[detailKey] ?? "",
                  "Add item",
                )}
                {onRequestDetailDelete ? (
                  <button
                    type="button"
                    className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
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
            <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2">
              <SubitemStatusSelect
                value={detailStatus}
                options={DETAIL_STATUS_OPTIONS}
                onChange={(value) => handleSubitemStatusChange(detailKey, value)}
              />
            </td>
            <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-2">
              {renderPicField(detailKey)}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2">
              {renderEditableDetailSubmission(
                detailKey,
                subitemSubmissionByKey[detailKey] ?? "",
                "Add submission",
                true,
              )}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2">
              {renderAttachmentCell(detailKey, "")}
            </td>
            <td className="w-[100px] min-w-[100px] max-w-[100px] px-3 py-2">
              {renderProgressSlider(detailKey, 0)}
            </td>
            <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-2">
              <SubitemPrioritySelect
                value={subitemPriorityByKey[detailKey] ?? ""}
                onChange={(value) =>
                  handleSubitemPriorityChange(detailKey, value)
                }
              />
            </td>
            <td className="w-[200px] min-w-[200px] max-w-[200px] px-3 py-2">
              {renderEditableSubitemTimelineCell(
                detailKey,
                subitemTimelineByKey[detailKey]?.startDate,
                subitemTimelineByKey[detailKey]?.dueDate,
                true,
              )}
            </td>
            <td className="w-[170px] min-w-[170px] max-w-[170px] px-3 py-2" colSpan={2}>
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
          className="border-b border-slate-200 bg-slate-50/40"
        >
          <td className="sticky left-0 z-30 w-[72px] min-w-[72px] max-w-[72px] bg-slate-50/40 px-3 py-2" />
          <td className="sticky left-[72px] z-20 w-[260px] min-w-[260px] max-w-[260px] bg-slate-50/40 px-3 py-2">
            <div className="flex items-center gap-2 pl-6">
              <button
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-slate-600"
                onClick={onAddDetailRow}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
                  +
                </span>
                <span>Add item</span>
              </button>
            </div>
          </td>
          <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2" />
          <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-2" />
          <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2" />
          <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2" />
          <td className="w-[100px] min-w-[100px] max-w-[100px] px-3 py-2" />
          <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-2" />
          <td className="w-[200px] min-w-[200px] max-w-[200px] px-3 py-2" />
          <td className="w-[170px] min-w-[170px] max-w-[170px] px-3 py-2" colSpan={2} />
        </DetailRow>
      )}
    </Fragment>
  );
};

export default DetailTable;
