import {
  normalizeAttachmentList,
  normalizeStages,
  STAGE_STEPS,
  STAGES,
} from "./tenderUtils.js";

const buildEmptyState = () => ({
  subitemStatusByKey: {},
  subitemPriorityByKey: {},
  subitemSubmissionByKey: {},
  subitemAttachmentByKey: {},
  subitemProgressByKey: {},
  subitemTimelineByKey: {},
  subitemNotesByKey: {},
  subitemPicByKey: {},
  detailRowsByStage: {},
  detailNameByKey: {},
  removedDetailStepsByStage: {},
});

const parseDetailIndex = (detailId) => {
  const match = String(detailId || "").match(/detail-(\d+)/);
  return match ? Number(match[1]) : Number.NaN;
};

const applySubitemToState = (state, key, data = {}) => {
  if (!key || !data) return;
  if (data.status) state.subitemStatusByKey[key] = data.status;
  if (data.priority) state.subitemPriorityByKey[key] = data.priority;
  if (data.submission) state.subitemSubmissionByKey[key] = data.submission;
  if (data.pic) state.subitemPicByKey[key] = data.pic;
  if (Number.isFinite(data.progress)) {
    state.subitemProgressByKey[key] = data.progress;
  }
  const attachments = normalizeAttachmentList(data.attachments);
  if (attachments.length) {
    state.subitemAttachmentByKey[key] = attachments;
  }
  const timeline = data.timeline || {};
  if (timeline.startDate || timeline.dueDate) {
    state.subitemTimelineByKey[key] = {
      startDate: timeline.startDate || "",
      dueDate: timeline.dueDate || "",
    };
  }
  if (data.notes) state.subitemNotesByKey[key] = data.notes;
};

export const buildSubitemStateFromTenders = (tenders = []) => {
  const state = buildEmptyState();
  let maxDetailIndex = -1;

  tenders.forEach((tender) => {
    const stages = tender?.subitems?.stages || [];
    stages.forEach((stage) => {
      if (!stage?.name) return;
      const stageKey = `${tender.id}::${stage.name}`;
      applySubitemToState(state, stageKey, stage);

      const removedSteps = Array.isArray(stage.removedSteps)
        ? stage.removedSteps.filter(Boolean)
        : [];
      if (removedSteps.length) {
        state.removedDetailStepsByStage[stageKey] = removedSteps;
      }

      const steps = Array.isArray(stage.steps) ? stage.steps : [];
      steps.forEach((step) => {
        if (!step?.name) return;
        const stepKey = `${stageKey}::${step.name}`;
        applySubitemToState(state, stepKey, step);
      });

      const details = Array.isArray(stage.details) ? stage.details : [];
      if (details.length) {
        state.detailRowsByStage[stageKey] = [];
      }
      details.forEach((detail) => {
        const detailId = String(detail?.id || "").trim();
        if (!detailId) return;
        const detailKey = `${stageKey}::${detailId}`;
        state.detailRowsByStage[stageKey].push(detailKey);
        if (detail?.name) {
          state.detailNameByKey[detailKey] = detail.name;
        }
        applySubitemToState(state, detailKey, detail);
        const index = parseDetailIndex(detailId);
        if (Number.isFinite(index)) {
          maxDetailIndex = Math.max(maxDetailIndex, index);
        }
      });
    });
  });

  return { state, maxDetailIndex };
};

export const resolveStagesForTender = (tender, customStagesByTender = {}) => {
  const customStages = customStagesByTender?.[tender.id];
  if (Array.isArray(customStages)) {
    return normalizeStages(customStages);
  }
  if (Array.isArray(tender.stages) && tender.stages.length) {
    return normalizeStages(tender.stages);
  }
  return STAGES;
};

const buildSubitemPayload = (key, maps, base = {}) => {
  const payload = { ...base };
  const status = maps.subitemStatusByKey[key];
  if (status) payload.status = status;
  const priority = maps.subitemPriorityByKey[key];
  if (priority) payload.priority = priority;
  const submission = maps.subitemSubmissionByKey[key];
  if (submission) payload.submission = submission;
  const pic = maps.subitemPicByKey[key];
  if (pic) payload.pic = pic;
  const attachments = normalizeAttachmentList(maps.subitemAttachmentByKey[key]);
  if (attachments.length) payload.attachments = attachments;
  const progress = maps.subitemProgressByKey[key];
  if (Number.isFinite(progress)) payload.progress = progress;
  const timeline = maps.subitemTimelineByKey[key];
  if (timeline?.startDate || timeline?.dueDate) {
    payload.timeline = {
      startDate: timeline.startDate || null,
      dueDate: timeline.dueDate || null,
    };
  }
  const hasNotes = Object.prototype.hasOwnProperty.call(
    maps.subitemNotesByKey,
    key,
  );
  if (hasNotes) {
    payload.notes = maps.subitemNotesByKey[key] || "";
  }
  return payload;
};

export const buildSubitemsPayload = ({ tender, stages, maps }) => {
  const stageList = Array.isArray(stages)
    ? normalizeStages(stages)
    : resolveStagesForTender(tender, {});

  const stagePayloads = stageList.map((stage) => {
    const stageKey = `${tender.id}::${stage.name}`;
    const payload = buildSubitemPayload(stageKey, maps, { name: stage.name });

    const removedSteps = maps.removedDetailStepsByStage[stageKey] || [];
    if (removedSteps.length) {
      payload.removedSteps = removedSteps;
    }

    const steps = Array.isArray(stage.steps)
      ? stage.steps
      : STAGE_STEPS[stage.name] || [];
    const stepPayloads = steps
      .filter((stepName) => !removedSteps.includes(stepName))
      .map((stepName) =>
        buildSubitemPayload(`${stageKey}::${stepName}`, maps, {
          name: stepName,
        }),
      )
      .filter((item) => Object.keys(item).length > 1);
    if (stepPayloads.length) {
      payload.steps = stepPayloads;
    }

    const detailKeys = maps.detailRowsByStage[stageKey] || [];
    const detailPayloads = detailKeys.map((detailKey) => {
      const detailId = String(detailKey).split("::").pop();
      const detailName = maps.detailNameByKey[detailKey] || "";
      return buildSubitemPayload(detailKey, maps, {
        id: detailId,
        name: detailName,
      });
    });
    if (detailPayloads.length) {
      payload.details = detailPayloads;
    }

    return payload;
  });

  return { stages: stagePayloads };
};

export const getMaxDetailIndexFromRows = (detailRowsByStage) => {
  let max = -1;
  Object.values(detailRowsByStage || {}).forEach((rows) => {
    rows.forEach((detailKey) => {
      const detailId = String(detailKey).split("::").pop();
      const index = parseDetailIndex(detailId);
      if (Number.isFinite(index)) {
        max = Math.max(max, index);
      }
    });
  });
  return max;
};
