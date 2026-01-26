import { useState } from "react";

import {
  getAttachmentLabel,
  getAttachmentUrl,
  isAttachmentLink,
  normalizeAttachmentList,
} from "../../../utils/tenderUtils.js";

const useAttachmentActions = ({
  subitemAttachmentByKey,
  removeAttachmentForKey,
}) => {
  const [confirmAttachment, setConfirmAttachment] = useState(null);

  const openAttachmentInNewTab = (value) => {
    if (!value) return;
    const url = getAttachmentUrl(value);
    if (url) {
      window.open(url, "_blank", "noopener");
      return;
    }
    if (isAttachmentLink(value)) {
      const normalized = getAttachmentUrl(value);
      if (normalized) {
        window.open(normalized, "_blank", "noopener");
        return;
      }
    }
    const label = getAttachmentLabel(value) || "Attachment";
    if (String(label).toLowerCase().startsWith("www.")) {
      window.open(`https://${label}`, "_blank", "noopener");
      return;
    }
    const popup = window.open("", "_blank", "noopener");
    if (!popup) return;
    popup.document.title = label;
    popup.document.body.innerHTML = `
      <div style="font-family: Inter, sans-serif; padding: 24px;">
        <h2 style="margin: 0 0 12px;">${label}</h2>
        <p style="color: #6b7280; margin: 0;">
          Preview will be available once the backend is connected.
        </p>
      </div>
    `;
  };

  const getPopoverAttachments = (attachmentMenu) => {
    if (!attachmentMenu) return [];
    return normalizeAttachmentList(
      subitemAttachmentByKey[attachmentMenu.key] ?? attachmentMenu.fallback,
    );
  };

  const handleAttachmentRemoveRequest = (attachmentMenu, attachments, index) => {
    if (!attachmentMenu) return;
    setConfirmAttachment({
      key: attachmentMenu.key,
      index,
      attachments,
    });
  };

  const confirmAttachmentDelete = (confirmPayload) => {
    if (!confirmPayload) return;
    removeAttachmentForKey(
      confirmPayload.key,
      confirmPayload.index,
      confirmPayload.attachments,
    );
    setConfirmAttachment(null);
  };

  return {
    confirmAttachment,
    setConfirmAttachment,
    openAttachmentInNewTab,
    getPopoverAttachments,
    handleAttachmentRemoveRequest,
    confirmAttachmentDelete,
  };
};

export default useAttachmentActions;
