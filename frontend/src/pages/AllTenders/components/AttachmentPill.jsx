import {
  formatAttachmentLabel,
  normalizeAttachmentList,
} from "../../../utils/tenderUtils.js";

const AttachmentPill = ({ attachments, onClick }) => {
  const normalized = normalizeAttachmentList(attachments);
  const isEmpty = normalized.length === 0;
  const label = formatAttachmentLabel(normalized);

  return (
    <button
      type="button"
      className={`attachment-pill-button${isEmpty ? " is-empty" : ""}`}
      onClick={(event) => onClick(event, normalized)}
    >
      <svg
        className="attach-icon"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M7 11l6-6a3 3 0 114 4l-7 7a5 5 0 11-7-7l7-7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="attachment-pill-text">{label}</span>
    </button>
  );
};

export default AttachmentPill;
