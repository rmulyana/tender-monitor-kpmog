import AttachmentPill from "./AttachmentPill.jsx";

const AttachmentCell = ({ attachmentKey, attachments, onOpen }) => {
  return (
    <AttachmentPill
      attachments={attachments}
      onClick={(event, normalized) => onOpen(attachmentKey, event, normalized)}
    />
  );
};

export default AttachmentCell;
