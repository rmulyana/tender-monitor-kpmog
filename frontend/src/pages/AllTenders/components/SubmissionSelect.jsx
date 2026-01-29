const SubmissionSelect = ({ value, onChange, placeholder = "Set Submission" }) => {
  const isEmpty = !value;
  const toneClass = isEmpty
    ? "bg-slate-100 text-slate-400"
    : value === "Offline"
      ? "bg-slate-600 text-white"
      : "bg-blue-500 text-white";

  return (
    <select
      className={[
        "h-7 w-[120px] rounded-full border border-transparent px-4 text-xs font-semibold text-center",
        "appearance-none",
        toneClass,
      ].join(" ")}
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
