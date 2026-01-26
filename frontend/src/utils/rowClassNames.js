export const tenderRowClass = ({ isOverdue = false, isArchived = false } = {}) => {
  const classes = ["tender-row"];
  if (isOverdue) classes.push("overdue");
  if (isArchived) classes.push("is-archived");
  return classes.join(" ");
};
