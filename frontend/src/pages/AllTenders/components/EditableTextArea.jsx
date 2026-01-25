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
        className="editable-textarea"
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

  return (
    <button type="button" className="editable-trigger" onClick={onBeginEdit}>
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

export default EditableTextArea;
