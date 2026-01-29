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
      className="absolute z-50 w-44 rounded-xl border border-slate-200 bg-white p-1 text-sm shadow-lg"
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
          <span className="h-4 w-4 text-slate-400" aria-hidden="true">
            <svg viewBox="0 0 20 20" fill="none">
              <rect
                x="6"
                y="6"
                width="10"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="3"
                y="3"
                width="10"
                height="10"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </span>
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
          <span className="h-4 w-4 text-slate-400" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M7 7v10a2 2 0 002 2h6a2 2 0 002-2V7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M9 11h6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
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
          <span className="h-4 w-4 text-slate-400" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M7 8H4V5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 8a8 8 0 111.6 4.7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 7v5l3 2"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
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
        <span className="h-4 w-4 text-rose-400" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
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
        </span>
        <span>Delete</span>
      </button>
    </div>
  );
};

export default RowMenuDropdown;
