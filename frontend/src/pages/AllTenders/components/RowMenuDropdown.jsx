import { Archive, Copy, RotateCcw, Trash2 } from "lucide-react";

const RowMenuDropdown = ({
  openMenuId,
  menuPosition,
  menuRef,
  tenders,
  allTenders,
  onDuplicate,
  onArchive,
  onRestore,
  onRequestDelete,
  onClose,
}) => {
  if (!openMenuId || !menuPosition) return null;

  const menuTender =
    tenders.find((item) => item.id === openMenuId) ||
    allTenders.find((item) => item.id === openMenuId);
  const isArchived = Boolean(menuTender?.archived);

  const handleDuplicate = () => {
    if (menuTender) {
      onDuplicate(menuTender);
      onClose();
      return;
    }
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute z-50 w-44 rounded-xl border border-slate-200 bg-white p-1 text-[0.7rem] shadow-lg"
      role="menu"
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
    >
      {!isArchived ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100"
          role="menuitem"
          onClick={handleDuplicate}
        >
          <Copy className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <span>Duplicate</span>
        </button>
      ) : null}
      {!isArchived ? (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100"
          role="menuitem"
          onClick={() => {
            if (onArchive) onArchive(openMenuId);
            onClose();
          }}
        >
          <Archive className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <span>Archive</span>
        </button>
      ) : (
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-600 hover:bg-slate-100"
          role="menuitem"
          onClick={() => {
            if (onRestore) onRestore(openMenuId);
            onClose();
          }}
        >
          <RotateCcw className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <span>Restore</span>
        </button>
      )}
      <button
        type="button"
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
        role="menuitem"
        onClick={() => {
          onRequestDelete(openMenuId);
          onClose();
        }}
      >
        <Trash2 className="h-4 w-4 text-rose-400" aria-hidden="true" />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default RowMenuDropdown;
