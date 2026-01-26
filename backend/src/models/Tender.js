const mongoose = require("mongoose");

const AttachmentSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, default: "" },
    url: { type: String, trim: true, default: "" },
    kind: {
      type: String,
      enum: ["link", "file"],
      default: "link",
    },
  },
  { _id: false },
);

const StageSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    steps: [{ type: String, trim: true }],
  },
  { _id: false },
);

const TimelineSchema = new mongoose.Schema(
  {
    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
  },
  { _id: false },
);

const SubitemSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, default: "" },
    name: { type: String, trim: true, default: "" },
    status: { type: String, trim: true, default: "" },
    priority: { type: String, trim: true, default: "" },
    submission: { type: String, trim: true, default: "" },
    pic: { type: String, trim: true, default: "" },
    attachments: { type: [AttachmentSchema], default: [] },
    progress: { type: Number, min: 0, max: 100 },
    timeline: { type: TimelineSchema, default: undefined },
    notes: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const StageDataSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    status: { type: String, trim: true, default: "" },
    priority: { type: String, trim: true, default: "" },
    submission: { type: String, trim: true, default: "" },
    pic: { type: String, trim: true, default: "" },
    attachments: { type: [AttachmentSchema], default: [] },
    progress: { type: Number, min: 0, max: 100 },
    timeline: { type: TimelineSchema, default: undefined },
    notes: { type: String, trim: true, default: "" },
    steps: { type: [SubitemSchema], default: [] },
    details: { type: [SubitemSchema], default: [] },
    removedSteps: { type: [String], default: [] },
  },
  { _id: false },
);

const SubitemsSchema = new mongoose.Schema(
  {
    stages: { type: [StageDataSchema], default: [] },
  },
  { _id: false },
);

const TenderSchema = new mongoose.Schema(
  {
    tenderId: { type: String, trim: true, index: true },
    pin: { type: String, trim: true, default: "" },
    projectTitle: { type: String, trim: true, default: "" },
    client: { type: String, trim: true, default: "" },
    consortium: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    currency: { type: String, trim: true, default: "IDR" },
    estValue: { type: Number, default: 0, min: 0 },
    stage: { type: String, trim: true, default: "Registration" },
    status: { type: String, trim: true, default: "Initiation" },
    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    overdueDays: { type: Number, default: 0 },
    remarks: { type: String, trim: true, default: "" },
    stages: { type: [StageSchema], default: [] },
    attachments: { type: [AttachmentSchema], default: [] },
    subitems: { type: SubitemsSchema, default: () => ({ stages: [] }) },
    archived: { type: Boolean, default: false },
    isDraft: { type: Boolean, default: false },
  },
  { timestamps: true },
);

TenderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret.tenderId || ret._id.toString();
    delete ret._id;
    return ret;
  },
});

TenderSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret.tenderId || ret._id.toString();
    delete ret._id;
    return ret;
  },
});

module.exports = mongoose.model("Tender", TenderSchema);
