import { Paperclip } from "lucide-react";
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
      data-attachment-pill
      className={[
        "inline-flex h-7 max-w-[200px] items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-[0.7rem] text-slate-600 cursor-pointer",
        isEmpty ? "text-slate-400" : "text-slate-700",
      ].join(" ")}
      onClick={(event) => onClick(event, normalized)}
    >
      {isEmpty ? null : (
        <Paperclip className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="truncate">{label}</span>
    </button>
  );
};

export default AttachmentPill;
