import { getAttachmentLabel } from "../../../utils/tenderUtils.js";

const AttachmentPopover = ({
  menu,
  attachments,
  tab,
  onTabChange,
  linkDraft,
  onLinkDraftChange,
  onOpenAttachment,
  onRequestRemove,
  onChooseFile,
  onFileChange,
  onLinkSave,
  menuRef,
  fileInputRef,
}) => {
  if (!menu) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
      role="dialog"
      aria-label="Attachment options"
      style={{
        top: `${menu.top}px`,
        left: `${menu.left}px`,
      }}
    >
      <div className="flex gap-2">
        <button
          type="button"
          className={`flex-1 rounded-full border px-3 py-2 text-xs font-semibold ${
            tab === "upload"
              ? "border-blue-500 bg-blue-50 text-blue-600"
              : "border-slate-200 text-slate-500"
          }`}
          onClick={() => onTabChange("upload")}
        >
          Upload
        </button>
        <button
          type="button"
          className={`flex-1 rounded-full border px-3 py-2 text-xs font-semibold ${
            tab === "embed"
              ? "border-blue-500 bg-blue-50 text-blue-600"
              : "border-slate-200 text-slate-500"
          }`}
          onClick={() => onTabChange("embed")}
        >
          Embed link
        </button>
      </div>
      {attachments.length > 0 && (
        <div className="mt-3 grid gap-2">
          {attachments.map((attachment, index) => {
            const label = getAttachmentLabel(attachment) || "Attachment";
            return (
              <div key={`${label}-${index}`} className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex-1 truncate text-left text-xs font-medium text-slate-600 hover:text-slate-800"
                  title={label}
                  onClick={() => onOpenAttachment(attachment)}
                >
                  {label}
                </button>
                <button
                  type="button"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-300 hover:bg-slate-100 hover:text-slate-600"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRequestRemove(index);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 7h16"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 11v6M14 11v6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
          );
          })}
        </div>
      )}
      {tab === "upload" ? (
        <div className="mt-3">
          <button
            type="button"
            className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            onClick={onChooseFile}
          >
            Choose a file
          </button>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            onChange={onFileChange}
          />
        </div>
      ) : (
        <div className="mt-3 grid gap-2">
          <input
            className="h-9 w-full rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-600 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
            type="url"
            placeholder="Paste link"
            value={linkDraft}
            onChange={(event) => onLinkDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onLinkSave();
              }
            }}
          />
          <button
            type="button"
            className="w-full rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-400"
            onClick={onLinkSave}
          >
            Add link
          </button>
        </div>
      )}
    </div>
  );
};

export default AttachmentPopover;
