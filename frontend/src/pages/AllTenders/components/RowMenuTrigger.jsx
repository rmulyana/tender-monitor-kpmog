const RowMenuTrigger = ({ tenderId, openMenuId, onToggleMenu }) => {
  return (
    <div className="ml-auto">
      <button
        type="button"
        className="menu-trigger inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
