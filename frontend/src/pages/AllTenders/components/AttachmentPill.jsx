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
      className={[
        "attachment-pill-button inline-flex h-7 max-w-[200px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-600",
        isEmpty ? "text-slate-400" : "text-slate-700",
      ].join(" ")}
      onClick={(event) => onClick(event, normalized)}
    >
      <svg
        className="h-4 w-4"
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
      <span className="truncate">{label}</span>
    </button>
  );
};

export default AttachmentPill;
