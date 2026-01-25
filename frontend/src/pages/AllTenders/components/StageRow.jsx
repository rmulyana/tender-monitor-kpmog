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
      <td className="w-pin sticky tree-empty" />
      <td className="w-title sticky2 divider-shadow wraptext tree-box tree-box-first">
        <div className="indent-1 stage-cell">
          {canExpand ? (
            <button
              className={`exp-btn${isStageOpen ? " is-open" : ""}`}
              type="button"
              aria-label={`Toggle ${stageName}`}
              aria-expanded={isStageOpen}
              onClick={onToggleStage}
            >
              <svg
                className="chev"
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
            <span className="exp-spacer" />
          )}
          <span>{stageName}</span>
          {onRequestStageDelete ? (
            <button
              type="button"
              className="row-delete"
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
      <td className="w-client tree-box">
        <SubitemStatusSelect
          value={stageStatus}
          options={stageStatusOptions}
          onChange={(value) => handleSubitemStatusChange(stageKey, value)}
        />
      </td>
      <td className="w-cons tree-box">{renderPicField(stageKey)}</td>
      <td className="w-stage tree-box">{renderSubmissionSelect(stageKey)}</td>
      <td className="w-status tree-box">
        {renderAttachmentCell(stageKey, "")}
      </td>
      <td className="w-date tree-box">{renderProgressSlider(stageKey, 0)}</td>
      <td className="w-priority tree-box">
        <SubitemPrioritySelect
          value={stagePriority}
          onChange={(value) => handleSubitemPriorityChange(stageKey, value)}
        />
      </td>
      <td className="w-timeline tree-box">
        {renderEditableSubitemTimelineCell(
          stageKey,
          timelineStart,
          timelineDue,
          true,
        )}
      </td>
      <td className="w-remarks tree-box tree-box-last notes-cell" colSpan={2}>
        {renderEditableSubitemNotes(stageKey, stageNotes, "Add notes", true)}
      </td>
    </>
  );
};

export default StageRow;
