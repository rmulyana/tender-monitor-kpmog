import { submissionClassName } from "../../../utils/tenderUtils.js";

const SubmissionSelect = ({ value, onChange, placeholder = "Set Submission" }) => {
  const isEmpty = !value;

  return (
    <select
      className={`subitem-submission-select ${submissionClassName(value)}${
        isEmpty ? " submission-none" : ""
      }`}
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      <option value="Online">Online</option>
      <option value="Offline">Offline</option>
    </select>
  );
};

export default SubmissionSelect;
