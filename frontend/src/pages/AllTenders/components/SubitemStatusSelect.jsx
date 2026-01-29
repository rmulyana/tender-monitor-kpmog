const SubitemStatusSelect = ({ value, options, onChange }) => {
  const statusTone = {
    "Not Started": "bg-slate-200 text-slate-600",
    "On Progress": "bg-orange-500 text-white",
    Done: "bg-emerald-500 text-white",
    Failed: "bg-red-500 text-white",
  };
  const toneClass = statusTone[value] || "bg-slate-200 text-slate-600";

  return (
    <select
      className={[
        "h-7 w-[120px] rounded-full border border-transparent px-4 text-xs font-semibold text-center",
        "appearance-none",
        toneClass,
      ].join(" ")}
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
