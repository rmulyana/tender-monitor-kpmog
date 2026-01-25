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
  const separator = currency === "IDR" ? "." : ",";
  return groupDigits(digits, separator);
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
    return (
      <div className="editable-est">
        <button type="button" className="editable-trigger" onClick={onBeginEdit}>
          {isEmptyValue ? (
            <span
              className={`editable-placeholder${
                usePillPlaceholder ? " pill-placeholder" : ""
              }`}
            >
              {placeholder}
            </span>
          ) : (
            displayValue
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="editable-est">
      <div
        className="editable-combo editable-combo-float"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            onCommit(event);
          }
        }}
      >
        <select
          className="editable-select"
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
          className="editable-input editable-value-input"
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
