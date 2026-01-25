import { statusClassName } from "../../../utils/tenderUtils.js";

const SubitemStatusSelect = ({ value, options, onChange }) => {
  return (
    <select
      className={`subitem-status-select ${statusClassName(value)}`}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SubitemStatusSelect;
