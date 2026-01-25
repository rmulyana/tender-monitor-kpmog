import ConfirmDialog from "../../../components/common/ConfirmDialog.jsx";

const TenderDialogs = ({
  confirmDeleteId,
  onConfirmDelete,
  onCancelDelete,
  confirmAttachment,
  onConfirmAttachmentDelete,
  onCancelAttachment,
  confirmSubitemDelete,
  onConfirmSubitemDelete,
  onCancelSubitemDelete,
}) => {
  return (
    <>
      {typeof onConfirmDelete === "function" && (
        <ConfirmDialog
          open={Boolean(confirmDeleteId)}
          title="Delete this item?"
          description="This action cannot be undone."
          confirmLabel="Yes, Delete"
          cancelLabel="No"
          onConfirm={() => onConfirmDelete(confirmDeleteId)}
          onCancel={onCancelDelete}
        />
      )}
      {typeof onConfirmAttachmentDelete === "function" && (
        <ConfirmDialog
          open={Boolean(confirmAttachment)}
          title="Delete this attachment?"
          description="This action cannot be undone."
          confirmLabel="Yes, Delete"
          cancelLabel="No"
          onConfirm={() => onConfirmAttachmentDelete(confirmAttachment)}
          onCancel={onCancelAttachment}
        />
      )}
      {typeof onConfirmSubitemDelete === "function" && (
        <ConfirmDialog
          open={Boolean(confirmSubitemDelete)}
          title="Delete this item?"
          description="This action cannot be undone."
          confirmLabel="Yes, Delete"
          cancelLabel="No"
          onConfirm={() => onConfirmSubitemDelete(confirmSubitemDelete)}
          onCancel={onCancelSubitemDelete}
        />
      )}
    </>
  );
};

export default TenderDialogs;
