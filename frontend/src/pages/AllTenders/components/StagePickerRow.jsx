import DetailRow from "./DetailRow.jsx";

const StagePickerRow = ({
  tenderId,
  isStagePickerOpen,
  stagePickerValue,
  availableStages,
  onStagePickerChange,
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
              </select>
              <div className="add-stage-actions">
                <button
                  type="button"
                  className="add-stage-cancel"
                  onClick={onCancelStagePicker}
                >
                  Cancel
                </button>
              </div>
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
