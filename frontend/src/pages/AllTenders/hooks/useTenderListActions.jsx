import SortableHeader from "../components/SortableHeader.jsx";

const useTenderListActions = ({
  allTenders,
  addTender,
  beginEditCell,
  getMainStatusOptions,
  nextPinForTenders,
  sortKey,
  setSortKey,
  sortDirection,
  setSortDirection,
}) => {
  const handleAddTender = () => {
    const stage = "Registration";
    const status = getMainStatusOptions(stage)[0] || "Initiation";
    const nextPin = nextPinForTenders(allTenders);
    const nextId = nextPin;

    addTender({
      id: nextId,
      pin: nextPin,
      projectTitle: "",
      client: "",
      consortium: "",
      location: "",
      currency: "IDR",
      estValue: 0,
      stage,
      status,
      startDate: "",
      dueDate: "",
      overdueDays: 0,
      remarks: "",
      stages: [],
      isDraft: true,
    });
    beginEditCell(nextId, "projectTitle", "");
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  };

  const sortIcon = (key) => {
    if (sortKey !== key) {
      return "fa-sort";
    }
    return sortDirection === "asc" ? "fa-caret-up" : "fa-caret-down";
  };

  const renderSortableHeader = (label, key, className = "") => {
    return (
      <SortableHeader
        label={label}
        sortKey={key}
        activeKey={sortKey}
        direction={sortDirection}
        onSort={handleSort}
        className={className}
        iconClassFor={sortIcon}
      />
    );
  };

  return {
    handleAddTender,
    renderSortableHeader,
  };
};

export default useTenderListActions;
