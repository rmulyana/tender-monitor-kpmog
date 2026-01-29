const MainStatusSelect = ({
  value,
  statusOptions,
  onChange,
  onBlur,
  isLocked = false,
}) => {
  const toneIndex = Math.max(0, statusOptions.indexOf(value));
  const isFailed = value === "Failed";
  const toneClasses = [
    "bg-slate-200 text-slate-600",
    "bg-blue-500 text-white",
    "bg-amber-500 text-white",
    "bg-purple-500 text-white",
    "bg-emerald-500 text-white",
  ];
  const statusClass = isFailed
    ? "bg-red-500 text-white"
    : toneClasses[toneIndex] || "bg-slate-200 text-slate-600";

  return (
    <select
      className={[
        "h-7 w-[120px] rounded-full border border-transparent px-4 text-xs font-semibold text-center",
        "appearance-none",
        statusClass,
        isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer",
      ].join(" ")}
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
