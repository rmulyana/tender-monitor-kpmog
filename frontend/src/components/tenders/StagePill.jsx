const stageTones = {
  Registration: "bg-blue-500 text-white",
  "Pre-Qualification": "bg-indigo-500 text-white",
  Proposal: "bg-amber-500 text-white",
  Negotiation: "bg-purple-500 text-white",
  Contract: "bg-emerald-500 text-white",
};

const StagePill = ({ stage }) => {
  const tone = stageTones[stage] || "bg-slate-200 text-slate-600";

  return (
    <span
      className={[
        "inline-flex h-7 w-[160px] items-center justify-center rounded-full px-4 text-center text-xs font-semibold",
        "truncate",
        tone,
      ].join(" ")}
    >
      {stage}
    </span>
  );
};

export default StagePill;
