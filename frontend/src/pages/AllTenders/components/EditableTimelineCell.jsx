import TenderTimeline from "../../../components/ui/Timeline/TenderTimeline.jsx";

const EditableTimelineCell = ({
  startDate,
  dueDate,
  overdueDays,
  onOpen,
  usePillPlaceholder = false,
}) => {
  const hasTimeline = Boolean(startDate) && Boolean(dueDate);

  return (
    <button type="button" className="timeline-edit-trigger" onClick={onOpen}>
      {hasTimeline ? (
        <TenderTimeline
          startDate={startDate}
          dueDate={dueDate}
          overdueDays={overdueDays}
        />
      ) : (
        <span
          className={`timeline-placeholder${
            usePillPlaceholder ? " pill-placeholder" : ""
          }`}
        >
          Add timeline
        </span>
      )}
    </button>
  );
};

export default EditableTimelineCell;
