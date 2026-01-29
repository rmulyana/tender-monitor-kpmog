import TenderTimeline from "../../../components/ui/Timeline/TenderTimeline.jsx";

const EditableTimelineCell = ({
  startDate,
  dueDate,
  overdueDays,
  onOpen,
  usePillPlaceholder = false,
}) => {
  const hasTimeline = Boolean(startDate) && Boolean(dueDate);
  const placeholderClass = usePillPlaceholder
    ? "inline-flex h-7 items-center rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-400"
    : "text-slate-400";

  return (
    <button
      type="button"
      className="timeline-edit-trigger w-full text-left text-sm text-slate-700 transition hover:text-slate-900"
      onClick={onOpen}
    >
      {hasTimeline ? (
        <TenderTimeline
          startDate={startDate}
          dueDate={dueDate}
          overdueDays={overdueDays}
        />
      ) : (
        <span className={placeholderClass}>Add timeline</span>
      )}
    </button>
  );
};

export default EditableTimelineCell;
