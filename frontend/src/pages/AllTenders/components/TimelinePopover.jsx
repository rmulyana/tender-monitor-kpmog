import TimelineRangePicker from "../../../components/ui/Timeline/TimelineRangePicker.jsx";
import { parseDateKey } from "../../../utils/tenderUtils.js";
import {
  extractTimePart,
  normalizeDateInput,
  normalizeDateTimeInput,
} from "../../../utils/timeline.js";

const TimelinePopover = ({
  menu,
  menuRef,
  editDraftStart,
  editDraftDue,
  setEditDraftStart,
  setEditDraftDue,
}) => {
  if (!menu) return null;

  const startValue = editDraftStart || normalizeDateInput(menu.fallbackStart);
  const dueValue = editDraftDue || normalizeDateTimeInput(menu.fallbackDue);
  const dueDateValue = dueValue ? dueValue.split("T")[0] : "";
  const dueTimeValue = extractTimePart(dueValue);

  return (
    <div
      ref={menuRef}
      className="timeline-popover"
      role="dialog"
      aria-label="Timeline picker"
      style={{
        top: `${menu.top}px`,
        left: `${menu.left}px`,
      }}
    >
      <TimelineRangePicker
        startDate={startValue}
        dueDate={dueDateValue}
        dueTime={dueTimeValue}
        onStartSelect={(dateStr) => {
          setEditDraftStart(dateStr);
          if (dueDateValue) {
            const startObj = parseDateKey(dateStr);
            const dueObj = parseDateKey(dueDateValue);
            if (startObj && dueObj && startObj > dueObj) {
              setEditDraftDue("");
            }
          }
        }}
        onDueSelect={(dateStr) => {
          if (!dateStr) {
            setEditDraftDue("");
            return;
          }
          const timeValue = dueTimeValue || "00:00";
          setEditDraftDue(`${dateStr}T${timeValue}`);
        }}
        onDueTimeChange={(time) => {
          if (!dueDateValue) return;
          setEditDraftDue(`${dueDateValue}T${time}`);
        }}
      />
    </div>
  );
};

export default TimelinePopover;
