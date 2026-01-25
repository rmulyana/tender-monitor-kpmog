const MainStatusSelect = ({ value, statusOptions, onChange, onBlur }) => {
  const toneIndex = Math.max(0, statusOptions.indexOf(value));

  return (
    <select
      className={`main-status-select status-tone-${toneIndex + 1}`}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
    >
      {statusOptions.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default MainStatusSelect;
