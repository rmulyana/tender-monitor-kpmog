import { useEffect, useRef, useState } from "react";

import { normalizeAttachmentList } from "../../../utils/tenderUtils.js";

const useAttachmentMenu = ({ addAttachmentForKey }) => {
  const [attachmentMenu, setAttachmentMenu] = useState(null);
  const [attachmentTab, setAttachmentTab] = useState("upload");
  const [attachmentLinkDraft, setAttachmentLinkDraft] = useState("");
  const attachmentMenuRef = useRef(null);
  const attachmentFileInputRef = useRef(null);

  const closeAttachmentMenu = () => {
    setAttachmentMenu(null);
    setAttachmentLinkDraft("");
  };

  const openAttachmentMenu = (key, event, attachments = []) => {
    event.stopPropagation();
    if (attachmentMenu?.key === key) {
      closeAttachmentMenu();
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 280;
    const left = Math.max(
      12,
      Math.min(rect.left, window.innerWidth - menuWidth - 12),
    );
    setAttachmentTab("upload");
    setAttachmentLinkDraft("");
    setAttachmentMenu({
      key,
      top: rect.bottom + 8,
      left,
      anchorTop: rect.top,
      anchorLeft: rect.left,
      fallback: normalizeAttachmentList(attachments),
    });
  };

  const handleAttachmentFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file || !attachmentMenu?.key) return;
    addAttachmentForKey(attachmentMenu.key, file.name, attachmentMenu.fallback);
    closeAttachmentMenu();
    event.target.value = "";
  };

  const handleAttachmentLinkSave = () => {
    const trimmed = String(attachmentLinkDraft || "").trim();
    if (!trimmed || !attachmentMenu?.key) return;
    const normalized = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    addAttachmentForKey(attachmentMenu.key, normalized, attachmentMenu.fallback);
    closeAttachmentMenu();
  };

  useEffect(() => {
    if (!attachmentMenu) return undefined;
    const handleClick = (event) => {
      if (attachmentMenuRef.current?.contains(event.target)) {
        return;
      }
      if (event.target.closest(".attachment-pill-button")) {
        return;
      }
      closeAttachmentMenu();
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        closeAttachmentMenu();
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [attachmentMenu]);

  useEffect(() => {
    if (!attachmentMenu) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const popover = attachmentMenuRef.current;
      if (!popover) return;
      const rect = popover.getBoundingClientRect();
      let nextTop = attachmentMenu.top;
      let nextLeft = attachmentMenu.left;
      const bottom = rect.top + rect.height;
      const right = rect.left + rect.width;

      if (bottom > window.innerHeight - 12) {
        nextTop = Math.max(12, attachmentMenu.anchorTop - rect.height - 8);
      }
      if (right > window.innerWidth - 12) {
        nextLeft = Math.max(12, window.innerWidth - rect.width - 12);
      }

      if (nextTop !== attachmentMenu.top || nextLeft !== attachmentMenu.left) {
        setAttachmentMenu((prev) =>
          prev ? { ...prev, top: nextTop, left: nextLeft } : prev,
        );
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [attachmentMenu]);

  return {
    attachmentMenu,
    attachmentTab,
    attachmentLinkDraft,
    attachmentMenuRef,
    attachmentFileInputRef,
    openAttachmentMenu,
    closeAttachmentMenu,
    setAttachmentTab,
    setAttachmentLinkDraft,
    handleAttachmentFileChange,
    handleAttachmentLinkSave,
  };
};

export default useAttachmentMenu;
