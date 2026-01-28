import { formatNumber } from "../../../utils/formatters.js";

const TargetModal = ({
  isOpen,
  year,
  valueRaw,
  isSaving,
  onChangeRaw,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="target-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Set Annual Contract Target"
      onClick={() => !isSaving && onClose()}
    >
      <div className="target-modal" onClick={(event) => event.stopPropagation()}>
        <div className="target-modal-header">
          <h3 className="target-modal-title">Annual Contract Target</h3>
          <p className="target-modal-subtitle">{year}</p>
        </div>
        <form className="target-modal-form" onSubmit={onSubmit}>
          <input
            id="annual-target"
            className="target-modal-input"
            inputMode="numeric"
            placeholder="set annual target"
            value={valueRaw ? formatNumber(Number(valueRaw), "IDR") : ""}
            onChange={(event) =>
              onChangeRaw(String(event.target.value || "").replace(/[^0-9]/g, ""))
            }
            disabled={isSaving}
            autoFocus
          />
          <div className="target-modal-actions">
            <button
              type="button"
              className="panel-select target-modal-cancel"
              onClick={() => onClose()}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="panel-select target-modal-save"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Target"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TargetModal;

