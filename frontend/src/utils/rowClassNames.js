export const tenderRowClass = ({ isArchived = false } = {}) => {
  const classes = ["group", "border-b", "border-slate-200"];
  if (isArchived) classes.push("opacity-70");
  return classes.join(" ");
};
