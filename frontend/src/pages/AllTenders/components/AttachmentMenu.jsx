import AttachmentPopover from "../../../components/ui/Attachment/AttachmentPopover.jsx";

const AttachmentMenu = ({
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
}) => (
  <AttachmentPopover
    menu={menu}
    attachments={attachments}
    tab={tab}
    onTabChange={onTabChange}
    linkDraft={linkDraft}
    onLinkDraftChange={onLinkDraftChange}
    onOpenAttachment={onOpenAttachment}
    onRequestRemove={onRequestRemove}
    onChooseFile={onChooseFile}
    onFileChange={onFileChange}
    onLinkSave={onLinkSave}
    menuRef={menuRef}
    fileInputRef={fileInputRef}
  />
);

export default AttachmentMenu;
