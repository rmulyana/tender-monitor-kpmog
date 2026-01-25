import { useState } from "react";

import {
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
    if (isAttachmentLink(value)) {
      window.open(value, "_blank", "noopener");
      return;
    }
    if (String(value).toLowerCase().startsWith("www.")) {
      window.open(`https://${value}`, "_blank", "noopener");
      return;
    }
    const popup = window.open("", "_blank", "noopener");
    if (!popup) return;
    popup.document.title = value;
    popup.document.body.innerHTML = `
      <div style="font-family: Inter, sans-serif; padding: 24px;">
        <h2 style="margin: 0 0 12px;">${value}</h2>
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
