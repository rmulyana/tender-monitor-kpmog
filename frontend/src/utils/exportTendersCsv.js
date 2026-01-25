import { formatDate, formatNumber } from "./formatters.js";
import { formatTimelineLabel } from "./timeline.js";

const exportTendersCsv = ({
  tenders,
  editedRows,
  mainStageById,
  mainStatusById,
}) => {
  const headers = [
    "PIN",
    "Project Title",
    "Client",
    "Consortium",
    "Location",
    "Est Value",
    "Stage",
    "Status",
    "Timeline",
    "Remarks",
  ];

  const rows = tenders.map((tender) => {
    const overrides = editedRows[tender.id] ?? {};
    const merged = { ...tender, ...overrides };
    const stageValue = mainStageById[tender.id] ?? tender.stage;
    const statusValue = mainStatusById[tender.id] ?? tender.status;
    const startValue = merged.startDate ?? tender.startDate;
    const dueValue = merged.dueDate ?? tender.dueDate;

    return [
      tender.pin,
      merged.projectTitle,
      merged.client,
      merged.consortium,
      merged.location,
      `${merged.currency} ${formatNumber(merged.estValue, merged.currency)}`,
      stageValue,
      statusValue,
      `${formatDate(startValue)} - ${formatDate(
        dueValue,
      )} (${formatTimelineLabel(startValue, dueValue)})`,
      merged.remarks,
    ];
  });

  const escapeValue = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const csvContent = [
    headers.map(escapeValue).join(","),
    ...rows.map((row) => row.map(escapeValue).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tenders-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export default exportTendersCsv;
