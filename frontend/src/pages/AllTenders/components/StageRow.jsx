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
      <td className="sticky left-0 z-30 w-[72px] min-w-[72px] max-w-[72px] bg-white px-3 py-2" />
      <td className="sticky left-[72px] z-20 w-[260px] min-w-[260px] max-w-[260px] bg-white px-3 py-2">
        <div className="flex items-center gap-2 pl-3">
          {canExpand ? (
            <button
              className={`inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 ${isStageOpen ? "rotate-180" : ""}`}
              type="button"
              aria-label={`Toggle ${stageName}`}
              aria-expanded={isStageOpen}
              onClick={onToggleStage}
            >
              <svg
                className="h-2.5 w-2.5"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 8l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <span className="h-5 w-5" />
          )}
          <span className="text-sm font-semibold text-slate-700">
            {stageName}
          </span>
          {onRequestStageDelete ? (
            <button
              type="button"
              className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-300 transition hover:bg-slate-100 hover:text-slate-600"
              aria-label={`Delete ${stageName}`}
              onClick={onRequestStageDelete}
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
          value={stageStatus}
          options={stageStatusOptions}
          onChange={(value) => handleSubitemStatusChange(stageKey, value)}
        />
      </td>
      <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-2">
        {renderPicField(stageKey)}
      </td>
      <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2">
        {renderSubmissionSelect(stageKey)}
      </td>
      <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2">
        {renderAttachmentCell(stageKey, "")}
      </td>
      <td className="w-[100px] min-w-[100px] max-w-[100px] px-3 py-2">
        {renderProgressSlider(stageKey, 0)}
      </td>
      <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-2">
        <SubitemPrioritySelect
          value={stagePriority}
          onChange={(value) => handleSubitemPriorityChange(stageKey, value)}
        />
      </td>
      <td className="w-[200px] min-w-[200px] max-w-[200px] px-3 py-2">
        {renderEditableSubitemTimelineCell(
          stageKey,
          timelineStart,
          timelineDue,
          true,
        )}
      </td>
      <td className="w-[170px] min-w-[170px] max-w-[170px] px-3 py-2" colSpan={2}>
        {renderEditableSubitemNotes(stageKey, stageNotes, "Add notes", true)}
      </td>
    </>
  );
};

export default StageRow;
