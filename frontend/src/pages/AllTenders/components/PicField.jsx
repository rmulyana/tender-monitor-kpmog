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
        className="subitem-pic-input"
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
    <button type="button" className="pic-display" onClick={onBeginEdit}>
      {renderDisplay(value)}
    </button>
  );
};

export default PicField;
