import { STAGES } from "../../../utils/tenderUtils.js";

const MainStageSelect = ({ value, onChange, onBlur, isLocked = false }) => {
  const stageTone = {
    Registration: "bg-blue-500 text-white",
    "Pre-Qualification": "bg-indigo-500 text-white",
    Proposal: "bg-amber-500 text-white",
    Negotiation: "bg-purple-500 text-white",
    Contract: "bg-emerald-500 text-white",
  };
  const toneClass = stageTone[value] || "bg-slate-200 text-slate-600";

  return (
    <select
      className={[
        "h-7 w-full min-w-[140px] max-w-[160px] rounded-full border border-transparent px-4 text-xs font-semibold text-center",
        "appearance-none",
        toneClass,
        isLocked ? "cursor-not-allowed opacity-70" : "cursor-pointer",
      ].join(" ")}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={isLocked}
    >
      {STAGES.map((stage) => (
        <option key={stage.name} value={stage.name}>
          {stage.name}
        </option>
      ))}
    </select>
  );
};

export default MainStageSelect;
