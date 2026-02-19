const statusTones = {
  "Not Started": "bg-slate-200 text-slate-500",
  "On Progress": "bg-amber-500 text-white",
  Done: "bg-emerald-500 text-white",
  Failed: "bg-red-500 text-white",
};

const StatusBadge = ({ status }) => {
  const tone = statusTones[status] || "bg-slate-200 text-slate-600";

  return (
    <span
      className={[
        "inline-flex h-7 min-w-[120px] items-center justify-center rounded-full px-4 text-center text-xs font-semibold",
        "truncate",
        tone,
      ].join(" ")}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
