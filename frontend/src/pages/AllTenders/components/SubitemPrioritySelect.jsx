const SubitemPrioritySelect = ({ value, onChange }) => {
  const priorityTone = {
    High: "bg-red-500 text-white",
    Medium: "bg-amber-500 text-white",
    Low: "bg-emerald-500 text-white",
  };
  const toneClass = value ? priorityTone[value] || "bg-slate-200 text-slate-600" : "bg-slate-100 text-slate-400";

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
