import AttachmentCell from "./components/AttachmentCell.jsx";
import EditableCell from "./components/EditableCell.jsx";
import EditableEstValue from "./components/EditableEstValue.jsx";
import EditableTextArea from "./components/EditableTextArea.jsx";
import EditableTimelineCell from "./components/EditableTimelineCell.jsx";
import TenderTimeline from "../../components/ui/Timeline/TenderTimeline.jsx";
import PicField from "./components/PicField.jsx";
import SubmissionSelect from "./components/SubmissionSelect.jsx";
import ProgressSlider from "../../components/ui/Progress/ProgressSlider.jsx";
import { normalizeSubmissionValue } from "../../utils/tenderUtils.js";

const createTenderRenderers = ({
  editingCell,
  editDraft,
  setEditDraft,
  editDraftCurrency,
  setEditDraftCurrency,
  beginEditCell,
  commitEditCell,
  cancelEditCell,
  beginEditEstValue,
  commitEstValue,
  maybeRemoveDraft,
  beginEditSubitemNotes,
  commitSubitemNotes,
  beginEditDetailName,
  commitDetailName,
  beginEditDetailSubmission,
  commitDetailSubmission,
  subitemSubmissionByKey,
  handleSubitemSubmissionChange,
  subitemProgressByKey,
  handleSubitemProgressChange,
  progressColor,
  subitemAttachmentByKey,
  openAttachmentMenu,
  subitemPicByKey,
  editingPicKey,
  picDraft,
  setPicDraft,
  beginEditPic,
  commitPic,
  cancelPicEdit,
  picCell,
  openTimelineMenu,
  overdueDays,
  mainTimelineReadOnly = false,
}) => {
  const renderEditableCell = (
    id,
    field,
    value,
    className = "",
    fallbackValue = value,
    editValue = value,
    placeholder = "Add",
    usePillPlaceholder = false,
  ) => {
    const isEditing = editingCell?.id === id && editingCell?.field === field;

    return (
      <EditableCell
        value={value}
        isEditing={isEditing}
        editDraft={editDraft}
        onDraftChange={setEditDraft}
        onBeginEdit={() => beginEditCell(id, field, editValue)}
        onCommit={(event) => {
          const trimmed = String(editDraft ?? "").trim();
          const nextValue = trimmed || fallbackValue;
          commitEditCell(id, field, fallbackValue);
          maybeRemoveDraft(id, { [field]: nextValue }, event);
        }}
        onCancel={() => {
          cancelEditCell();
          maybeRemoveDraft(id, { [field]: fallbackValue });
        }}
        className={className}
        placeholder={placeholder}
        usePillPlaceholder={usePillPlaceholder}
      />
    );
  };

  const renderEditableTextArea = (
    id,
    field,
    value,
    placeholder = "Add",
    usePillPlaceholder = false,
  ) => {
    const isEditing = editingCell?.id === id && editingCell?.field === field;
    return (
      <EditableTextArea
        value={value}
        isEditing={isEditing}
        editDraft={editDraft}
        onDraftChange={setEditDraft}
        onBeginEdit={() => beginEditCell(id, field, value)}
        onCommit={(event) => {
          const trimmed = String(editDraft ?? "").trim();
          const nextValue = trimmed || value;
          commitEditCell(id, field, value);
          maybeRemoveDraft(id, { [field]: nextValue }, event);
        }}
        onCancel={() => {
          cancelEditCell();
          maybeRemoveDraft(id, { [field]: value });
        }}
        placeholder={placeholder}
        usePillPlaceholder={usePillPlaceholder}
      />
    );
  };

  const renderEditableEstValueCell = (
    id,
    displayValue,
    value,
    currency,
    editValue,
    placeholder = "Add value",
    usePillPlaceholder = false,
  ) => {
    const isEditing =
      editingCell?.id === id && editingCell?.field === "estValue";
    return (
      <EditableEstValue
        isEditing={isEditing}
        displayValue={displayValue}
        value={value}
        currency={currency}
        editDraft={editDraft}
        editDraftCurrency={editDraftCurrency}
        onDraftChange={setEditDraft}
        onCurrencyChange={setEditDraftCurrency}
        onBeginEdit={() => beginEditEstValue(id, editValue, currency)}
        onCommit={(event) => {
          const trimmed = String(editDraft ?? "").trim();
          const numeric = Number(trimmed.replace(/[^\d.-]/g, ""));
          const nextValue = Number.isFinite(numeric) ? numeric : value;
          const nextCurrency = editDraftCurrency || currency;
          commitEstValue(id, value, currency);
          maybeRemoveDraft(
            id,
            { estValue: nextValue, currency: nextCurrency },
            event,
          );
        }}
        onCancel={() => {
          cancelEditCell();
          maybeRemoveDraft(id, { estValue: value, currency });
        }}
        placeholder={placeholder}
        usePillPlaceholder={usePillPlaceholder}
      />
    );
  };

  const renderEditableTimelineCell = (
    id,
    startDate,
    dueDate,
    overdueValue,
    usePillPlaceholder = false,
  ) => {
    if (mainTimelineReadOnly) {
      const hasTimeline = Boolean(startDate) && Boolean(dueDate);
      return (
        <div className="timeline-edit-trigger is-readonly" aria-readonly="true">
          {hasTimeline ? (
            <TenderTimeline
              startDate={startDate}
              dueDate={dueDate}
              overdueDays={overdueValue}
            />
          ) : (
            <span
              className={`timeline-placeholder${
                usePillPlaceholder ? " pill-placeholder" : ""
              }`}
            >
              Add timeline
            </span>
          )}
        </div>
      );
    }

    return (
      <EditableTimelineCell
        startDate={startDate}
        dueDate={dueDate}
        overdueDays={overdueValue}
        usePillPlaceholder={usePillPlaceholder}
        onOpen={(event) =>
          openTimelineMenu({ id, mode: "main", startDate, dueDate }, event)
        }
      />
    );
  };

  const renderEditableSubitemTimelineCell = (
    key,
    startDate,
    dueDate,
    usePillPlaceholder = false,
  ) => {
    return (
      <EditableTimelineCell
        startDate={startDate}
        dueDate={dueDate}
        overdueDays={overdueDays(dueDate)}
        usePillPlaceholder={usePillPlaceholder}
        onOpen={(event) =>
          openTimelineMenu({ id: key, mode: "subitem", startDate, dueDate }, event)
        }
      />
    );
  };

  const renderEditableSubitemNotes = (
    key,
    value,
    placeholder = "Add notes",
    usePillPlaceholder = false,
  ) => {
    const isEditing =
      editingCell?.id === key && editingCell?.field === "subitemNotes";
    const isEmpty = value === null || value === undefined || value === "";

    if (isEditing) {
      return (
        <textarea
          className="editable-textarea"
          value={editDraft}
          autoFocus
          rows={2}
          onChange={(event) => setEditDraft(event.target.value)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              commitSubitemNotes(key, value);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              commitSubitemNotes(key, value);
            }
            if (event.key === "Escape") {
              event.preventDefault();
              cancelEditCell();
            }
          }}
        />
      );
    }

    return (
      <button
        type="button"
        className="editable-trigger"
        onClick={() => beginEditSubitemNotes(key, value)}
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

  const renderSubmissionSelect = (key, fallbackValue = "") => {
    const value =
      subitemSubmissionByKey[key] ?? normalizeSubmissionValue(fallbackValue);

    return (
      <SubmissionSelect
        value={value}
        onChange={(nextValue) => handleSubitemSubmissionChange(key, nextValue)}
      />
    );
  };

  const renderProgressSlider = (key, fallbackValue = 0) => {
    const value =
      subitemProgressByKey[key] ?? Math.max(0, Math.min(100, fallbackValue));
    const safe = Math.max(0, Math.min(100, Number(value) || 0));
    const color = progressColor(safe);

    return (
      <ProgressSlider
        value={safe}
        color={color}
        onChange={(event) =>
          handleSubitemProgressChange(key, event.target.value)
        }
      />
    );
  };

  const renderEditableDetailName = (key, value, placeholder = "Add item") => {
    const isEditing =
      editingCell?.id === key && editingCell?.field === "detailName";
    const isEmpty = value === null || value === undefined || value === "";

    if (isEditing) {
      return (
        <input
          className="editable-input"
          type="text"
          value={editDraft}
          autoFocus
          onChange={(event) => setEditDraft(event.target.value)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              commitDetailName(key, value);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitDetailName(key, value);
            }
            if (event.key === "Escape") {
              event.preventDefault();
              cancelEditCell();
            }
          }}
        />
      );
    }

    return (
      <button
        type="button"
        className="editable-trigger editable-inline"
        onClick={() => beginEditDetailName(key, value)}
      >
        {isEmpty ? (
          <span className="editable-placeholder">{placeholder}</span>
        ) : (
          value
        )}
      </button>
    );
  };

  const renderEditableDetailSubmission = (
    key,
    value,
    placeholder = "Add submission",
    usePillPlaceholder = false,
  ) => {
    const isEditing =
      editingCell?.id === key && editingCell?.field === "detailSubmission";
    const isEmpty = value === null || value === undefined || value === "";

    if (isEditing) {
      return (
        <input
          className="editable-input"
          type="text"
          value={editDraft}
          autoFocus
          onChange={(event) => setEditDraft(event.target.value)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              commitDetailSubmission(key, value);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitDetailSubmission(key, value);
            }
            if (event.key === "Escape") {
              event.preventDefault();
              cancelEditCell();
            }
          }}
        />
      );
    }

    return (
      <button
        type="button"
        className="editable-trigger"
        onClick={() => beginEditDetailSubmission(key, value)}
      >
        {isEmpty ? (
          <span
            className={`editable-placeholder${
              usePillPlaceholder
                ? " pill-placeholder pill-placeholder-submission"
                : ""
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

  const renderAttachmentCell = (key, fallbackAttachment = "") => {
    const attachments = subitemAttachmentByKey[key] ?? fallbackAttachment;

    return (
      <AttachmentCell
        attachmentKey={key}
        attachments={attachments}
        onOpen={openAttachmentMenu}
      />
    );
  };

  const renderPicField = (key) => {
    const value = subitemPicByKey[key] || "";
    const isEditing = editingPicKey === key || !value;
    const inputValue = editingPicKey === key ? picDraft : value;

    return (
      <PicField
        value={value}
        isEditing={isEditing}
        inputValue={inputValue}
        onBeginEdit={() => beginEditPic(key)}
        onDraftChange={(nextValue) => {
          if (editingPicKey !== key) {
            beginEditPic(key);
          }
          setPicDraft(nextValue);
        }}
        onCommit={() => commitPic(key, picDraft)}
        onCancel={cancelPicEdit}
        renderDisplay={picCell}
      />
    );
  };

  return {
    renderEditableCell,
    renderEditableTextArea,
    renderEditableEstValueCell,
    renderEditableTimelineCell,
    renderEditableSubitemTimelineCell,
    renderEditableSubitemNotes,
    renderSubmissionSelect,
    renderProgressSlider,
    renderEditableDetailName,
    renderEditableDetailSubmission,
    renderAttachmentCell,
    renderPicField,
  };
};

export default createTenderRenderers;
