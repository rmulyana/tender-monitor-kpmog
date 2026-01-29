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
      className="border-b border-slate-200 bg-slate-50/40"
    >
      <td className="sticky left-0 z-30 w-[72px] min-w-[72px] max-w-[72px] bg-slate-50/40 px-3 py-2" />
      <td className="sticky left-[72px] z-20 w-[260px] min-w-[260px] max-w-[260px] bg-slate-50/40 px-3 py-2">
        <div className="pl-3">
          {isStagePickerOpen ? (
            <div className="grid gap-2">
              <select
                className="h-8 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600"
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold text-slate-600"
                  onClick={onCancelStagePicker}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-slate-600"
              type="button"
              onClick={onOpenStagePicker}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
                +
              </span>
              <span>Add item</span>
            </button>
          )}
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
  );
};

export default StagePickerRow;
