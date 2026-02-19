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
        className="h-8 w-full rounded-lg border border-slate-200 bg-white px-3 text-[0.7rem] text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
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
    ? "inline-flex h-7 items-center justify-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 text-[0.7rem] text-slate-400 text-center"
    : "text-slate-400";

  const alignClass = className.includes("text-center") ? "text-center" : "text-left";

  return (
    <button
      type="button"
      className={`w-full ${alignClass} text-[0.7rem] text-slate-700 transition hover:text-slate-900 ${className}`.trim()}
      onClick={onBeginEdit}
    >
      {isEmpty ? <span className={placeholderClass}>{placeholder}</span> : value}
    </button>
  );
};

export default EditableCell;
