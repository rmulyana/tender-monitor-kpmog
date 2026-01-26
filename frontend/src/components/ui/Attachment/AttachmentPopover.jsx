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
      className="attachment-popover"
      role="dialog"
      aria-label="Attachment options"
      style={{
        top: `${menu.top}px`,
        left: `${menu.left}px`,
      }}
    >
      <div className="attachment-tabs">
        <button
          type="button"
          className={`attachment-tab${tab === "upload" ? " is-active" : ""}`}
          onClick={() => onTabChange("upload")}
        >
          Upload
        </button>
        <button
          type="button"
          className={`attachment-tab${tab === "embed" ? " is-active" : ""}`}
          onClick={() => onTabChange("embed")}
        >
          Embed link
        </button>
      </div>
      {attachments.length > 0 && (
        <div className="attachment-list">
          {attachments.map((attachment, index) => {
            const label = getAttachmentLabel(attachment) || "Attachment";
            return (
            <div key={`${label}-${index}`} className="attachment-item">
              <button
                type="button"
                className="attachment-item-name"
                title={label}
                onClick={() => onOpenAttachment(attachment)}
              >
                {label}
              </button>
              <button
                type="button"
                className="attachment-item-remove"
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
        <div className="attachment-panel">
          <button
            type="button"
            className="attachment-upload-btn"
            onClick={onChooseFile}
          >
            Choose a file
          </button>
          <input
            ref={fileInputRef}
            className="attachment-hidden-input"
            type="file"
            onChange={onFileChange}
          />
        </div>
      ) : (
        <div className="attachment-panel">
          <input
            className="attachment-link-input"
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
            className="attachment-link-btn"
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
