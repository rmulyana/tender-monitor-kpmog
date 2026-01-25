import "../../styles/tenders.css";

const statusClasses = {
  "Not Started": "status-not-started",
  "On Progress": "status-on-progress",
  Done: "status-done",
  Failed: "status-failed",
};

const StatusBadge = ({ status }) => (
  <span className={`status-badge ${statusClasses[status] || ""}`.trim()}>
    {status}
  </span>
);

export default StatusBadge;
