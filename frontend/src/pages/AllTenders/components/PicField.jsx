const PicField = ({
  value,
  isEditing,
  inputValue,
  onBeginEdit,
  onDraftChange,
  onCommit,
  onCancel,
  renderDisplay,
}) => {
  if (isEditing) {
    return (
      <input
        className="h-8 w-full rounded-full border border-slate-200 bg-white px-4 text-center text-[0.7rem] text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
        type="text"
        value={inputValue}
        placeholder="Search PIC"
        onFocus={onBeginEdit}
        onChange={(event) => onDraftChange(event.target.value)}
        onBlur={onCommit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onCommit();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
          }
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className="inline-flex w-full items-center justify-center gap-2 text-[0.7rem] font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
      onClick={onBeginEdit}
    >
      {renderDisplay(value)}
    </button>
  );
};

export default PicField;
