export const tenderRowClass = ({ isOverdue = false, isArchived = false } = {}) => {
  const classes = [
    "group",
    "border-b",
    "border-slate-200",
    "bg-white",
    "hover:bg-orange-200/20",
  ];
  if (isOverdue) classes.push("bg-amber-50/50");
  if (isArchived) classes.push("opacity-70");
  return classes.join(" ");
};
