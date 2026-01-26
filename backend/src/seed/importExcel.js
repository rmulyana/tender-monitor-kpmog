require("dotenv").config();

const path = require("path");
const xlsx = require("xlsx");

const connectDb = require("../config/db");
const Tender = require("../models/Tender");

const STAGES = [
  "Registration",
  "Pre-Qualification",
  "Proposal",
  "Negotiation",
  "Contract",
];

const STAGE_MAP = {
  registration: "Registration",
  "pre-qualification": "Pre-Qualification",
  "pre qualification": "Pre-Qualification",
  proposal: "Proposal",
  negotiation: "Negotiation",
  contract: "Contract",
};

const STATUS_MAP = {
  Registration: {
    initiation: "Initiation",
    "on progress": "On Progress",
    clarification: "Clarification",
    "under evaluation": "Evaluation",
    evaluation: "Evaluation",
  },
  "Pre-Qualification": {
    planning: "Planning",
    "on progress": "On Progress",
    clarification: "Clarification",
    "under evaluation": "Evaluation",
    evaluation: "Evaluation",
  },
  Proposal: {
    planning: "Planning",
    "on progress": "On Progress",
    clarification: "Clarification",
    "under evaluation": "Evaluation",
    evaluation: "Evaluation",
  },
  Negotiation: {
    planning: "Planning",
    "on progress": "On Progress",
    clarification: "Clarification",
    "under evaluation": "Evaluation",
    evaluation: "Evaluation",
  },
  Contract: {
    "award announcement": "Award",
    award: "Award",
    "standstill period": "Standstill",
    standstill: "Standstill",
    "letter of award (loa)": "Letter of Award",
    "letter of award": "Letter of Award",
    "contract signed": "Signed",
    signed: "Signed",
  },
};

const DEFAULT_STATUS = {
  Registration: "Initiation",
  Contract: "Award",
  Default: "Planning",
};

const STAGE_DATE_FIELDS = {
  Registration: "RegDate",
  "Pre-Qualification": "PQDate",
  Proposal: "ProposalDate",
  Negotiation: "NegoDate",
  Contract: "AwardDate",
};

const normalizeText = (value) => String(value || "").trim();

const normalizeLower = (value) => normalizeText(value).toLowerCase();

const parseNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
};

const excelDateToJs = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return value;
  if (typeof value === "number") {
    return new Date(Date.UTC(1899, 11, 30) + value * 86400000);
  }
  const trimmed = normalizeText(value);
  if (!trimmed) return null;
  const numeric = Number(trimmed);
  if (Number.isFinite(numeric)) {
    return new Date(Date.UTC(1899, 11, 30) + numeric * 86400000);
  }
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const mapStage = (value) => {
  const key = normalizeLower(value);
  return STAGE_MAP[key] || "";
};

const mapStatus = (stage, step) => {
  const key = normalizeLower(step);
  const map = STATUS_MAP[stage] || {};
  return map[key] || "";
};

const defaultStatusForStage = (stage) =>
  DEFAULT_STATUS[stage] || DEFAULT_STATUS.Default;

const toDateMap = (row) => ({
  openDate: excelDateToJs(row.OpenDate),
  regDate: excelDateToJs(row.RegDate),
  pqDate: excelDateToJs(row.PQDate),
  proposalDate: excelDateToJs(row.ProposalDate),
  negoDate: excelDateToJs(row.NegoDate),
  awardDate: excelDateToJs(row.AwardDate),
  lostDate: excelDateToJs(row.LostDate),
});

const resolveStageDueDate = (stage, dates) => {
  if (!stage) return null;
  const field = STAGE_DATE_FIELDS[stage];
  if (!field) return null;
  const key = field[0].toLowerCase() + field.slice(1);
  return dates[key] || null;
};

const getDateBounds = (dates) => {
  const values = Object.values(dates).filter((value) => value instanceof Date);
  if (!values.length) return { min: null, max: null };
  const sorted = [...values].sort((a, b) => a - b);
  return { min: sorted[0], max: sorted[sorted.length - 1] };
};

const buildSubitemStages = (dates) =>
  STAGES.map((stage) => {
    const dueDate = resolveStageDueDate(stage, dates);
    if (!dueDate) return null;
    return { name: stage, timeline: { dueDate } };
  }).filter(Boolean);

const mapRowToTender = (row) => {
  const pin = normalizeText(row.PIN);
  if (!pin) return null;

  const stage = mapStage(row.PipelineStage) || "Registration";
  const outcome = normalizeLower(row.OutcomeStatus);
  const isFailed =
    normalizeLower(row.IsFailed) === "yes" || outcome === "lost";

  const dates = toDateMap(row);
  const stageDueDate = resolveStageDueDate(stage, dates);
  const baseStatus =
    mapStatus(stage, row.StageStep) || defaultStatusForStage(stage);
  const wonOverride =
    outcome === "won" && stage === "Contract" ? "Signed" : baseStatus;
  const normalizedStatus = wonOverride || defaultStatusForStage(stage);
  const status = normalizedStatus;
  const statusBeforeFailure = "";

  const { min, max } = getDateBounds(dates);
  const startDate = dates.openDate || min;
  let dueDate = stageDueDate || max || dates.openDate || null;
  if (isFailed && dates.lostDate) {
    dueDate = dates.lostDate;
  }

  const failedAt = isFailed ? dates.lostDate || stageDueDate || null : null;
  const contractAt =
    stage === "Contract" || status === "Signed"
      ? dates.awardDate || stageDueDate || null
      : null;

  const statusChangedAt =
    failedAt || contractAt || stageDueDate || dates.openDate || null;

  const subitemsStages = buildSubitemStages(dates);

  return {
    pin,
    projectTitle: normalizeText(row.ProjectTitle),
    client: normalizeText(row.Client),
    consortium: normalizeText(row.Consortium),
    location: normalizeText(row.Location),
    currency: normalizeText(row.Currency) || "IDR",
    estValue: parseNumber(row.EstimatedValue) || 0,
    stage,
    status,
    statusBeforeFailure,
    outcomeStatus: outcome ? outcome[0].toUpperCase() + outcome.slice(1) : "",
    isFailed,
    startDate,
    dueDate,
    statusChangedAt,
    failedAt,
    contractAt,
    remarks: normalizeText(row.Remarks),
    subitems: { stages: subitemsStages },
    archived: false,
    isDraft: false,
  };
};

const run = async () => {
  const fileArg = process.argv[2];
  const shouldReset = process.argv.includes("--reset");

  if (!fileArg) {
    console.error(
      "Usage: npm run import:excel -- <path-to-xlsx> [--reset]",
    );
    process.exit(1);
  }

  const filePath = path.isAbsolute(fileArg)
    ? fileArg
    : path.resolve(process.cwd(), fileArg);

  try {
    await connectDb(process.env.MONGODB_URI);

    const workbook = xlsx.readFile(filePath, {
      cellDates: true,
      cellNF: false,
      cellText: false,
    });
    const sheet =
      workbook.Sheets.Master || workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) {
      throw new Error("Master sheet not found");
    }

    const rows = xlsx.utils.sheet_to_json(sheet, {
      defval: "",
      raw: true,
    });
    const mapped = rows
      .map(mapRowToTender)
      .filter((item) => item && item.pin);

    if (!mapped.length) {
      console.log("No rows mapped from the Excel file.");
      process.exit(0);
    }

    if (shouldReset) {
      await Tender.deleteMany({});
    }

    const operations = mapped.map((tender) => ({
      updateOne: {
        filter: { pin: tender.pin },
        update: { $set: tender },
        upsert: true,
      },
    }));

    const result = await Tender.bulkWrite(operations);
    const inserted = result.upsertedCount || 0;
    const updated = result.modifiedCount || 0;
    console.log(
      `Import complete. Total rows: ${mapped.length}, inserted: ${inserted}, updated: ${updated}`,
    );
    process.exit(0);
  } catch (error) {
    console.error("Import failed", error);
    process.exit(1);
  }
};

run();
