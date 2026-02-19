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
      className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-900/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Set Annual Contract Target"
      onClick={() => !isSaving && onClose()}
    >
      <div
        className="grid w-full max-w-[460px] gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-base font-bold text-indigo-900">
            Annual Contract Target
          </h3>
          <p className="text-base font-bold text-indigo-900">{year}</p>
        </div>
        <form className="grid gap-2" onSubmit={onSubmit}>
          <input
            id="annual-target"
            className="rounded-xl border border-slate-200 px-3 py-2 text-base font-semibold text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20"
            inputMode="numeric"
            placeholder="set annual target"
            value={valueRaw ? formatNumber(Number(valueRaw), "IDR") : ""}
            onChange={(event) =>
              onChangeRaw(String(event.target.value || "").replace(/[^0-9]/g, ""))
            }
            disabled={isSaving}
            autoFocus
          />
          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-[0.75rem] font-semibold text-slate-700 transition hover:border-orange-400"
              onClick={() => onClose()}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg border border-orange-500 bg-orange-500 px-4 py-2 text-[0.75rem] font-semibold text-white transition hover:border-orange-400 hover:shadow-[0_10px_24px_rgba(249,115,22,0.3)] disabled:opacity-70"
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
