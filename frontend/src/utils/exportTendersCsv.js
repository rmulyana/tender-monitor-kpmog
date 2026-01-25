import { formatDate, formatNumber } from "./formatters.js";
import { formatTimelineLabel } from "./timeline.js";
import {
  STAGES,
  buildStageDates,
  computeStageEndDate,
  getPriorityStatus,
  normalizeStages,
} from "./tenderUtils.js";

const exportTendersCsv = ({
  tenders,
  editedRows,
  mainStageById,
  mainStatusById,
  customStagesByTender,
  subitemStatusByKey,
  subitemPriorityByKey,
  subitemSubmissionByKey,
  subitemTimelineByKey,
  subitemNotesByKey,
  subitemPicByKey,
  subitemProgressByKey,
  mode = "main",
}) => {
  const isAll = mode === "all";
  const headers = isAll
    ? [
        "PIN",
        "Project Title",
        "Client",
        "Consortium",
        "Location",
        "Est Value",
        "Main Stage",
        "Main Status",
        "Main Timeline",
        "Remarks",
        "Stage",
        "Child Status",
        "Priority",
        "PIC",
        "Submission",
        "Timeline",
        "Notes",
        "Progress",
      ]
    : [
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

  const formatTimeline = (startValue, dueValue) => {
    if (!startValue && !dueValue) return "";
    return `${formatDate(startValue)} - ${formatDate(
      dueValue,
    )} (${formatTimelineLabel(startValue, dueValue)})`;
  };
  const rows = [];

  tenders.forEach((tender) => {
    const overrides = editedRows[tender.id] ?? {};
    const merged = { ...tender, ...overrides };
    const stageValue = mainStageById[tender.id] ?? tender.stage;
    const storedMainStatus = mainStatusById[tender.id] ?? tender.status;
    const startValue = merged.startDate ?? tender.startDate;
    const dueValue = merged.dueDate ?? tender.dueDate;
    const mainRow = [
      tender.pin,
      merged.projectTitle,
      merged.client,
      merged.consortium,
      merged.location,
      `${merged.currency} ${formatNumber(merged.estValue, merged.currency)}`,
      stageValue,
      storedMainStatus,
      formatTimeline(startValue, dueValue),
      merged.remarks,
    ];
    const stagesForTender =
      customStagesByTender?.[tender.id] ??
      (Array.isArray(tender.stages) ? normalizeStages(tender.stages) : STAGES);
    const timelineStages = stagesForTender.length ? stagesForTender : STAGES;
    const stageDates = buildStageDates(merged, timelineStages);

    const childStatuses = Object.keys(subitemStatusByKey || {})
      .filter((key) => key.startsWith(`${tender.id}::`))
      .map((key) => subitemStatusByKey[key])
      .filter(Boolean);
    const childPriorityStatus = getPriorityStatus(childStatuses);
    const mainStatus =
      childPriorityStatus === "Failed" ? "Failed" : storedMainStatus;
    mainRow[7] = mainStatus;

    if (!isAll) {
      rows.push(mainRow);
      return;
    }

    rows.push([...mainRow, "", "", "", "", "", "", "", ""]);
    if (!stagesForTender.length) {
      return;
    }

    stagesForTender.forEach((stage, index) => {
      const stageKey = `${tender.id}::${stage.name}`;
      const stageStatus = subitemStatusByKey?.[stageKey] ?? "Not Started";
      const stagePriority = subitemPriorityByKey?.[stageKey] ?? "";
      const stagePic = subitemPicByKey?.[stageKey] ?? "";
      const stageSubmission = subitemSubmissionByKey?.[stageKey] ?? "";
      const stageTimeline = subitemTimelineByKey?.[stageKey] ?? {};
      const stageNotes = subitemNotesByKey?.[stageKey] ?? "";
      const stageProgress = subitemProgressByKey?.[stageKey];
      const timelineStart =
        stageTimeline.startDate ?? stageDates[stage.name] ?? "";
      const timelineDue =
        stageTimeline.dueDate ??
        computeStageEndDate(stageDates, index, timelineStages) ??
        "";

      rows.push([
        ...mainRow,
        stage.name,
        stageStatus,
        stagePriority,
        stagePic,
        stageSubmission,
        formatTimeline(timelineStart, timelineDue),
        stageNotes,
        Number.isFinite(stageProgress) ? `${stageProgress}%` : "",
      ]);
    });
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
