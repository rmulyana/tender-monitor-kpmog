const EditableTextArea = ({
  value,
  isEditing,
  editDraft,
  onDraftChange,
  onBeginEdit,
  onCommit,
  onCancel,
  placeholder = "Add",
  usePillPlaceholder = false,
}) => {
  const isEmpty = value === null || value === undefined || value === "";

  if (isEditing) {
    return (
      <textarea
        className="min-h-[38px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
        value={editDraft}
        autoFocus
        rows={2}
        onChange={(event) => onDraftChange(event.target.value)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            onCommit(event);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
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
      className="w-full text-left text-sm text-slate-700 transition hover:text-slate-900"
      onClick={onBeginEdit}
    >
      {isEmpty ? <span className={placeholderClass}>{placeholder}</span> : value}
    </button>
  );
};

export default EditableTextArea;
