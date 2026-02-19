import { Fragment } from "react";
import { Trash2 } from "lucide-react";

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
  omitPinColumn = false,
}) => {
  if (!isOpen) return null;

  const hiddenSteps = removedStepsByStage?.[stageKey] ?? [];
  const visibleSteps = steps.filter(
    (stepName) => !hiddenSteps.includes(stepName),
  );

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
            className="border-b border-slate-200"
          >
            {!omitPinColumn ? (
              <td className="w-[72px] min-w-[72px] max-w-[72px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100 relative">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-1 bg-orange-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                />
              </td>
            ) : null}
            <td
              className={[
                "w-[260px] min-w-[260px] max-w-[260px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100",
                omitPinColumn
                  ? "relative px-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-orange-500 before:opacity-0 before:transition-opacity group-hover:before:opacity-100"
                  : "",
              ].join(" ")}
            >
              <div className="flex w-full items-center gap-2">
                <div
                  className={`flex min-w-0 flex-1 items-center gap-2 text-[0.7rem] text-slate-600 ${omitPinColumn ? "pl-8" : "pl-6"}`}
                >
                  <span className="text-slate-400">↳</span>
                  <span>{stepName}</span>
                </div>
                {onRequestStepDelete ? (
                  <button
                    type="button"
                    className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-red-500"
                    aria-label={`Delete ${stepName}`}
                    onClick={() => onRequestStepDelete(stageKey, stepName)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              <SubitemStatusSelect
                value={stepStatus}
                options={DETAIL_STATUS_OPTIONS}
                onChange={(value) => handleSubitemStatusChange(stepKey, value)}
              />
            </td>
            <td className="w-[120px] min-w-[120px] max-w-[120px] bg-white px-3 py-2 align-middle text-center group-hover:bg-orange-100">
              {renderPicField(stepKey)}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              {renderEditableDetailSubmission(
                stepKey,
                subitemSubmissionByKey[stepKey] ?? meta.submission ?? "",
                "Add submission",
                true,
              )}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              {renderAttachmentCell(stepKey, meta.attachment)}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              {renderProgressSlider(stepKey, 0)}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              <SubitemPrioritySelect
                value={subitemPriorityByKey[stepKey] ?? ""}
                onChange={(value) =>
                  handleSubitemPriorityChange(stepKey, value)
                }
              />
            </td>
            <td className="w-[200px] min-w-[200px] max-w-[200px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              {renderEditableSubitemTimelineCell(
                stepKey,
                subitemTimelineByKey[stepKey]?.startDate,
                subitemTimelineByKey[stepKey]?.dueDate,
                true,
              )}
            </td>
            <td
              className="w-[170px] min-w-[170px] max-w-[170px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100"
              colSpan={2}
            >
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
          <DetailRow
            key={`${detailKey}-${index}`}
            className="border-b border-slate-200"
          >
            {!omitPinColumn ? (
              <td className="w-[72px] min-w-[72px] max-w-[72px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100 relative">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-1 bg-orange-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                />
              </td>
            ) : null}
            <td
              className={[
                "w-[260px] min-w-[260px] max-w-[260px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100",
                omitPinColumn
                  ? "relative px-4 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-orange-500 before:opacity-0 before:transition-opacity group-hover:before:opacity-100"
                  : "",
              ].join(" ")}
            >
              <div className="flex w-full items-center gap-2">
                <div
                  className={`flex min-w-0 flex-1 items-center gap-2 text-[0.7rem] text-slate-600 ${omitPinColumn ? "pl-8" : "pl-6"}`}
                >
                  <span className="text-slate-400">↳</span>
                  {renderEditableDetailName(
                    detailKey,
                    detailNameByKey[detailKey] ?? "",
                    "Add item",
                  )}
                </div>
                {onRequestDetailDelete ? (
                  <button
                    type="button"
                    className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-red-500"
                    aria-label="Delete detail item"
                    onClick={() => onRequestDetailDelete(stageKey, detailKey)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              <SubitemStatusSelect
                value={detailStatus}
                options={DETAIL_STATUS_OPTIONS}
                onChange={(value) =>
                  handleSubitemStatusChange(detailKey, value)
                }
              />
            </td>
            <td className="w-[120px] min-w-[120px] max-w-[120px] bg-white px-3 py-2 align-middle text-center group-hover:bg-orange-100">
              {renderPicField(detailKey)}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              {renderEditableDetailSubmission(
                detailKey,
                subitemSubmissionByKey[detailKey] ?? "",
                "Add submission",
                true,
              )}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              {renderAttachmentCell(detailKey, "")}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              {renderProgressSlider(detailKey, 0)}
            </td>
            <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              <SubitemPrioritySelect
                value={subitemPriorityByKey[detailKey] ?? ""}
                onChange={(value) =>
                  handleSubitemPriorityChange(detailKey, value)
                }
              />
            </td>
            <td className="w-[200px] min-w-[200px] max-w-[200px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
              {renderEditableSubitemTimelineCell(
                detailKey,
                subitemTimelineByKey[detailKey]?.startDate,
                subitemTimelineByKey[detailKey]?.dueDate,
                true,
              )}
            </td>
            <td
              className="w-[170px] min-w-[170px] max-w-[170px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100"
              colSpan={2}
            >
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
          className="border-b border-slate-200 bg-white"
        >
          {!omitPinColumn ? (
            <td className="w-[72px] min-w-[72px] max-w-[72px] bg-white px-3 py-2" />
          ) : null}
          <td
            className={[
              "w-[260px] min-w-[260px] max-w-[260px] bg-white px-3 py-2",
              omitPinColumn ? "relative px-4" : "",
            ].join(" ")}
          >
            <div
              className={`flex items-center gap-2 ${omitPinColumn ? "pl-8" : "pl-6"}`}
            >
              <button
                type="button"
                className="group inline-flex cursor-pointer items-center gap-2 text-[0.7rem] font-semibold text-slate-400 transition hover:text-slate-600"
                onClick={onAddDetailRow}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition group-hover:border-orange-400">
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
          <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2" />
          <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2" />
          <td className="w-[200px] min-w-[200px] max-w-[200px] px-3 py-2" />
          <td
            className="w-[170px] min-w-[170px] max-w-[170px] px-3 py-2"
            colSpan={2}
          />
        </DetailRow>
      )}
    </Fragment>
  );
};

export default DetailTable;
