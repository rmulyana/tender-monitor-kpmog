import { priorityClassName } from "../../../utils/tenderUtils.js";

const SubitemPrioritySelect = ({ value, onChange }) => {
  return (
    <select
      className={`subitem-priority-select ${priorityClassName(value)}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="" disabled>
        Set Priority
      </option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
  );
};

export default SubitemPrioritySelect;
