export const tenderRowClass = ({ isOverdue = false } = {}) => {
  const classes = ["tender-row"];
  if (isOverdue) classes.push("overdue");
  return classes.join(" ");
};
