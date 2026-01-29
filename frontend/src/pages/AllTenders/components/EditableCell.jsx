const EditableCell = ({
  value,
  isEditing,
  editDraft,
  onDraftChange,
  onBeginEdit,
  onCommit,
  onCancel,
  className = "",
  placeholder = "Add",
  usePillPlaceholder = false,
}) => {
  const isEmpty = value === null || value === undefined || value === "";

  if (isEditing) {
    return (
      <input
        className="h-8 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
        type="text"
        value={editDraft}
        autoFocus
        onChange={(event) => onDraftChange(event.target.value)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            onCommit(event);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onCommit(event);
          }
          if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
          }
        }}
      />
    );
  }

  const placeholderClass = usePillPlaceholder
    ? "inline-flex h-7 items-center rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-400"
    : "text-slate-400";

  return (
    <button
      type="button"
      className={`w-full text-left text-sm text-slate-700 transition hover:text-slate-900 ${className}`.trim()}
      onClick={onBeginEdit}
    >
      {isEmpty ? <span className={placeholderClass}>{placeholder}</span> : value}
    </button>
  );
};

export default EditableCell;
