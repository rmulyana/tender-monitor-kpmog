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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-slate-900 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h4 className="text-base font-semibold">{title}</h4>
        {description && (
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-full bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-600"
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
