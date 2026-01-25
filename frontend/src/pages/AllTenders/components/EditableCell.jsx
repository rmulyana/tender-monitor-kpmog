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
        className="editable-input"
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

  return (
    <button
      type="button"
      className={`editable-trigger ${className}`.trim()}
      onClick={onBeginEdit}
    >
      {isEmpty ? (
        <span
          className={`editable-placeholder${
            usePillPlaceholder ? " pill-placeholder" : ""
          }`}
        >
          {placeholder}
        </span>
      ) : (
        value
      )}
    </button>
  );
};

export default EditableCell;
