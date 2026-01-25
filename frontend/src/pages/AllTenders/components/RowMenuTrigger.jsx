const RowMenuTrigger = ({ tenderId, openMenuId, onToggleMenu }) => {
  return (
    <div className="row-menu">
      <button
        type="button"
        className="menu-trigger"
        aria-haspopup="menu"
        aria-expanded={openMenuId === tenderId}
        aria-label="More actions"
        onClick={(event) => {
          onToggleMenu(tenderId, event);
        }}
      >
        ⋮
      </button>
    </div>
  );
};

export default RowMenuTrigger;
