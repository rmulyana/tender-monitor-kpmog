const MainStatusSelect = ({
  value,
  statusOptions,
  onChange,
  onBlur,
  isLocked = false,
}) => {
  const toneIndex = Math.max(0, statusOptions.indexOf(value));
  const isFailed = value === "Failed";
  const statusClass = isFailed
    ? "status-failed"
    : `status-tone-${toneIndex + 1}`;

  return (
    <select
      className={`main-status-select ${statusClass}${
        isLocked ? " is-locked" : ""
      }`}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={isLocked}
    >
      {isFailed && !statusOptions.includes("Failed") ? (
        <option value="Failed" hidden>
          Failed
        </option>
      ) : null}
      {statusOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default MainStatusSelect;
