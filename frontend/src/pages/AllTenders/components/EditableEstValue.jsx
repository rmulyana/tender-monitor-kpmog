import { useLayoutEffect, useRef } from "react";

const groupDigits = (digits, separator) =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

const countDigits = (value) => (value.match(/\d/g) || []).length;

const getCaretFromDigitIndex = (formatted, digitIndex) => {
  if (digitIndex <= 0) return 0;
  let count = 0;
  for (let i = 0; i < formatted.length; i += 1) {
    if (/\d/.test(formatted[i])) {
      count += 1;
      if (count === digitIndex) return i + 1;
    }
  }
  return formatted.length;
};

const formatDraftValue = (rawValue, currency) => {
  const digits = String(rawValue || "").replace(/\D/g, "");
  if (!digits) return "";
  const normalized = digits.replace(/^0+(?=\d)/, "");
  if (!normalized) return "";
  const separator = currency === "IDR" ? "." : ",";
  return groupDigits(normalized, separator);
};

const EditableEstValue = ({
  isEditing,
  displayValue,
  value,
  currency,
  editDraft,
  editDraftCurrency,
  onDraftChange,
  onCurrencyChange,
  onBeginEdit,
  onCommit,
  onCancel,
  placeholder = "Add value",
  usePillPlaceholder = false,
}) => {
  const inputRef = useRef(null);
  const caretRef = useRef(null);
  const numericValue = Number(value);
  const isEmptyValue =
    value === null || value === undefined || !Number.isFinite(numericValue) ||
    numericValue <= 0;
  const activeCurrency = editDraftCurrency || currency;

  useLayoutEffect(() => {
    if (caretRef.current === null) return;
    const caret = caretRef.current;
    caretRef.current = null;
    if (!inputRef.current) return;
    requestAnimationFrame(() => {
      if (document.activeElement === inputRef.current) {
        inputRef.current.setSelectionRange(caret, caret);
      }
    });
  }, [editDraft]);

  if (!isEditing) {
    const placeholderClass = usePillPlaceholder
      ? "inline-flex h-7 items-center rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-400"
      : "text-slate-400";

    return (
      <div>
        <button
          type="button"
          className="w-full text-left text-sm text-slate-700 transition hover:text-slate-900"
          onClick={onBeginEdit}
        >
          {isEmptyValue ? (
            <span className={placeholderClass}>{placeholder}</span>
          ) : (
            displayValue
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-2"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            onCommit(event);
          }
        }}
      >
        <select
          className="h-8 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600"
          value={activeCurrency}
          onChange={(event) => {
            const nextCurrency = event.target.value;
            onCurrencyChange(nextCurrency);
            const formatted = formatDraftValue(editDraft, nextCurrency);
            caretRef.current = formatted.length;
            onDraftChange(formatted);
          }}
        >
          <option value="IDR">IDR</option>
          <option value="USD">USD</option>
        </select>
        <input
          className="h-8 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
          type="text"
          value={editDraft}
          autoFocus
          ref={inputRef}
          onChange={(event) => {
            const rawValue = event.target.value;
            const caret = event.target.selectionStart ?? rawValue.length;
            const digitIndex = countDigits(rawValue.slice(0, caret));
            const formatted = formatDraftValue(rawValue, activeCurrency);
            caretRef.current = getCaretFromDigitIndex(formatted, digitIndex);
            onDraftChange(formatted);
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
      </div>
    </div>
  );
};

export default EditableEstValue;
