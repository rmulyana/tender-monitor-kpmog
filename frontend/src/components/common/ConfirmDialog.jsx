const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Yes, Delete",
  cancelLabel = "No",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div
      className="confirm-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div className="confirm-card" onClick={(event) => event.stopPropagation()}>
        <h4>{title}</h4>
        {description && <p>{description}</p>}
        <div className="confirm-actions">
          <button
            type="button"
            className="button button-ghost"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="button button-danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
