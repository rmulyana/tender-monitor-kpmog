import { ChevronDown, Trash2 } from "lucide-react";
import SubitemPrioritySelect from "./SubitemPrioritySelect.jsx";
import SubitemStatusSelect from "./SubitemStatusSelect.jsx";

const StageRow = ({
  stageKey,
  stageName,
  canExpand,
  isStageOpen,
  stageStatus,
  stageStatusOptions,
  stagePriority,
  timelineStart,
  timelineDue,
  stageNotes,
  omitPinColumn = false,
  renderPicField,
  renderSubmissionSelect,
  renderAttachmentCell,
  renderProgressSlider,
  renderEditableSubitemTimelineCell,
  renderEditableSubitemNotes,
  handleSubitemStatusChange,
  handleSubitemPriorityChange,
  onToggleStage,
  onRequestStageDelete,
}) => {
  return (
    <>
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
            className={`flex min-w-0 flex-1 items-center gap-2 ${omitPinColumn ? "pl-1" : "pl-3"}`}
          >
            {canExpand ? (
              <button
                className={`inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-orange-400 hover:bg-slate-50 hover:text-slate-600 ${isStageOpen ? "rotate-180" : ""}`}
                type="button"
                aria-label={`Toggle ${stageName}`}
                aria-expanded={isStageOpen}
                onClick={onToggleStage}
              >
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              </button>
            ) : (
              <span className="h-5 w-5" />
            )}
            <span className="text-[0.7rem] font-semibold text-slate-700">
              {stageName}
            </span>
          </div>
          {onRequestStageDelete ? (
            <button
              type="button"
              className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-red-500"
              aria-label={`Delete ${stageName}`}
              onClick={onRequestStageDelete}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </td>
      <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
        <SubitemStatusSelect
          value={stageStatus}
          options={stageStatusOptions}
          onChange={(value) => handleSubitemStatusChange(stageKey, value)}
        />
      </td>
      <td className="w-[120px] min-w-[120px] max-w-[120px] bg-white px-3 py-2 align-middle text-center group-hover:bg-orange-100">
        {renderPicField(stageKey)}
      </td>
      <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle text-center group-hover:bg-orange-100">
        {renderSubmissionSelect(stageKey)}
      </td>
      <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
        {renderAttachmentCell(stageKey, "")}
      </td>
      <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
        {renderProgressSlider(stageKey, 0)}
      </td>
      <td className="w-[150px] min-w-[150px] max-w-[150px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
        <SubitemPrioritySelect
          value={stagePriority}
          onChange={(value) => handleSubitemPriorityChange(stageKey, value)}
        />
      </td>
      <td className="w-[200px] min-w-[200px] max-w-[200px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100">
        {renderEditableSubitemTimelineCell(
          stageKey,
          timelineStart,
          timelineDue,
          true,
        )}
      </td>
      <td className="w-[170px] min-w-[170px] max-w-[170px] bg-white px-3 py-2 align-middle group-hover:bg-orange-100" colSpan={2}>
        {renderEditableSubitemNotes(stageKey, stageNotes, "Add notes", true)}
      </td>
    </>
  );
};

export default StageRow;
