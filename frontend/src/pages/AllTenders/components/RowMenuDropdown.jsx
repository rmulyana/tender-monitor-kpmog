const RowMenuDropdown = ({
  openMenuId,
  menuPosition,
  menuRef,
  tenders,
  allTenders,
  onDuplicate,
  onRequestDelete,
  onClose,
}) => {
  if (!openMenuId || !menuPosition) return null;

  const handleDuplicate = () => {
    const menuTender =
      tenders.find((item) => item.id === openMenuId) ||
      allTenders.find((item) => item.id === openMenuId);
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
      className="menu-dropdown menu-dropdown-floating"
      role="menu"
      style={{
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
      }}
    >
      <button
        type="button"
        className="menu-item menu-item-with-icon"
        role="menuitem"
        onClick={handleDuplicate}
      >
        <span className="menu-icon" aria-hidden="true">
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
      <button
        type="button"
        className="menu-item is-danger menu-item-with-icon"
        role="menuitem"
        onClick={() => {
          onRequestDelete(openMenuId);
          onClose();
        }}
      >
        <span className="menu-icon" aria-hidden="true">
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
