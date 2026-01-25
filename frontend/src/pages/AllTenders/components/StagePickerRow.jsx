import { CUSTOM_STAGE_VALUE } from "../../../utils/tenderUtils.js";
import DetailRow from "./DetailRow.jsx";

const StagePickerRow = ({
  tenderId,
  isStagePickerOpen,
  stagePickerValue,
  customStageValue,
  availableStages,
  onStagePickerChange,
  onCustomStageChange,
  onCustomStageKeyDown,
  onAddCustomStage,
  onCancelStagePicker,
  onOpenStagePicker,
}) => {
  return (
    <DetailRow
      key={`${tenderId}-add-subitem`}
      className="row-step block block-end"
    >
      <td className="w-pin sticky tree-empty" />
      <td className="w-title sticky2 divider-shadow wraptext tree-box tree-box-first">
        <div className="indent-1">
          {isStagePickerOpen ? (
            <div className="add-stage-field">
              <select
                className="add-stage-select"
                autoFocus
                value={stagePickerValue}
                onChange={onStagePickerChange}
              >
                <option value="" disabled>
                  Choose Stage
                </option>
                {availableStages.map((stageName) => (
                  <option key={stageName} value={stageName}>
                    {stageName}
                  </option>
                ))}
                <option value={CUSTOM_STAGE_VALUE}>Custom Stage</option>
              </select>
              {stagePickerValue === CUSTOM_STAGE_VALUE && (
                <div className="add-stage-actions">
                  <input
                    className="add-stage-input"
                    type="text"
                    value={customStageValue}
                    onChange={onCustomStageChange}
                    onKeyDown={onCustomStageKeyDown}
                    placeholder="Choose Stage"
                  />
                  <button
                    type="button"
                    className="add-stage-confirm"
                    onClick={onAddCustomStage}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="add-stage-cancel"
                    onClick={onCancelStagePicker}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="add-item"
              type="button"
              onClick={onOpenStagePicker}
            >
              <span className="add-circle">+</span>
              <span>Add item</span>
            </button>
          )}
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
  );
};

export default StagePickerRow;
