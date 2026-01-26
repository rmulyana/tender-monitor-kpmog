import {
  ADD_ITEM_STAGES,
  STAGE_NAMES,
  STANDARD_STAGE_SET,
  STAGE_STEPS,
  STAGES,
  buildStageDates,
  computeStageEndDate,
  normalizeStages,
} from "../../../utils/tenderUtils.js";
import DetailRow from "./DetailRow.jsx";
import DetailTable from "./DetailTable.jsx";
import StagePickerRow from "./StagePickerRow.jsx";
import StageRow from "./StageRow.jsx";

const STAGE_STATUS_OPTIONS = ["Not Started", "On Progress", "Done", "Failed"];

const buildStageRows = ({
  tender,
  expandedStages,
  toggleStage,
  stagePickerForTender,
  stagePickerValue,
  setStagePickerValue,
  setStagePickerForTender,
  customStagesByTender,
  openStagePicker,
  handleAddStage,
  handleAddDetailRow,
  subitemStatusByKey,
  subitemPriorityByKey,
  subitemSubmissionByKey,
  subitemTimelineByKey,
  subitemNotesByKey,
  detailRowsByStage,
  detailNameByKey,
  removedDetailStepsByStage,
  renderers,
  handleSubitemStatusChange,
  handleSubitemPriorityChange,
  onRequestDetailDelete,
  onRequestStepDelete,
  onRequestStageDelete,
}) => {
  const {
    renderSubmissionSelect,
    renderPicField,
    renderProgressSlider,
    renderEditableSubitemTimelineCell,
    renderEditableSubitemNotes,
    renderEditableDetailSubmission,
    renderEditableDetailName,
    renderAttachmentCell,
  } = renderers;
  const baseStages = Array.isArray(tender.stages)
    ? normalizeStages(tender.stages)
    : STAGES;
  const stagesForTender = customStagesByTender[tender.id] ?? baseStages;
  const timelineStages = stagesForTender.length > 0 ? stagesForTender : STAGES;
  const stageNames = new Set(stagesForTender.map((stage) => stage.name));
  const availableStages = STAGE_NAMES.filter((name) => !stageNames.has(name));
  const isStagePickerOpen = stagePickerForTender === tender.id;
  const stageDates = buildStageDates(tender, timelineStages);
  const stageRows = [];

  stagesForTender.forEach((stage, index) => {
    const key = `${tender.id}::${stage.name}`;
    const steps = Array.isArray(stage.steps)
      ? stage.steps
      : STAGE_STEPS[stage.name] || [];
    const hasSteps = steps.length > 0;
    const isManualStage = Boolean(stage.isManual);
    const showMeta = !isManualStage;
    const isCustomStageRow = !STANDARD_STAGE_SET.has(
      String(stage.name).trim().toLowerCase(),
    );
    const shouldShowAddItem =
      ADD_ITEM_STAGES.has(stage.name) || isCustomStageRow;
    const canExpand = hasSteps || shouldShowAddItem;
    const isStageOpen = expandedStages.has(key);
    const stageStatus = subitemStatusByKey[key] ?? "Not Started";
    const stagePriority = subitemPriorityByKey[key] ?? "";
    const stageDate = showMeta ? stageDates[stage.name] : null;
    const stageEndDate = showMeta
      ? computeStageEndDate(stageDates, index, timelineStages)
      : null;
    const stageTimeline = subitemTimelineByKey[key];
    const timelineStart = stageTimeline?.startDate
      ? stageTimeline.startDate
      : stageDate;
    const timelineDue = stageTimeline?.dueDate
      ? stageTimeline.dueDate
      : stageEndDate;
    const stageNotes = subitemNotesByKey[key] ?? "";

    stageRows.push(
      <DetailRow
        key={`${tender.id}-stage-${stage.name}`}
        className="row-stage block"
      >
        <StageRow
          stageKey={key}
          stageName={stage.name}
          canExpand={canExpand}
          isStageOpen={isStageOpen}
          stageStatus={stageStatus}
          stageStatusOptions={STAGE_STATUS_OPTIONS}
          stagePriority={stagePriority}
          timelineStart={timelineStart}
          timelineDue={timelineDue}
          stageNotes={stageNotes}
          renderPicField={renderPicField}
          renderSubmissionSelect={renderSubmissionSelect}
          renderAttachmentCell={renderAttachmentCell}
          renderProgressSlider={renderProgressSlider}
          renderEditableSubitemTimelineCell={renderEditableSubitemTimelineCell}
          renderEditableSubitemNotes={renderEditableSubitemNotes}
          handleSubitemStatusChange={handleSubitemStatusChange}
          handleSubitemPriorityChange={handleSubitemPriorityChange}
          onToggleStage={() => toggleStage(key)}
          onRequestStageDelete={
            onRequestStageDelete
              ? () => onRequestStageDelete(tender.id, stage.name, stagesForTender)
              : null
          }
        />
      </DetailRow>,
    );

    stageRows.push(
      <DetailTable
        key={`${tender.id}-detail-${stage.name}`}
        tenderId={tender.id}
        stageKey={key}
        stageName={stage.name}
        steps={steps}
        detailKeys={detailRowsByStage[key] ?? []}
        detailNameByKey={detailNameByKey}
        removedStepsByStage={removedDetailStepsByStage}
        subitemStatusByKey={subitemStatusByKey}
        subitemPriorityByKey={subitemPriorityByKey}
        subitemSubmissionByKey={subitemSubmissionByKey}
        subitemTimelineByKey={subitemTimelineByKey}
        subitemNotesByKey={subitemNotesByKey}
        renderPicField={renderPicField}
        renderEditableDetailSubmission={renderEditableDetailSubmission}
        renderAttachmentCell={renderAttachmentCell}
        renderProgressSlider={renderProgressSlider}
        renderEditableSubitemTimelineCell={renderEditableSubitemTimelineCell}
        renderEditableSubitemNotes={renderEditableSubitemNotes}
        renderEditableDetailName={renderEditableDetailName}
        handleSubitemStatusChange={handleSubitemStatusChange}
        handleSubitemPriorityChange={handleSubitemPriorityChange}
        onRequestDetailDelete={onRequestDetailDelete}
        onRequestStepDelete={onRequestStepDelete}
        isOpen={isStageOpen}
        showAddItem={shouldShowAddItem}
        onAddDetailRow={() => handleAddDetailRow(key)}
      />,
    );
  });

  stageRows.push(
    <StagePickerRow
      key={`${tender.id}-add-subitem`}
      tenderId={tender.id}
      isStagePickerOpen={isStagePickerOpen}
      stagePickerValue={stagePickerValue}
      availableStages={availableStages}
      onStagePickerChange={(event) => {
        const value = event.target.value;
        setStagePickerValue(value);
        if (value) {
          handleAddStage(tender.id, value, stagesForTender);
        }
      }}
      onCancelStagePicker={() => setStagePickerForTender(null)}
      onOpenStagePicker={() => openStagePicker(tender.id)}
    />,
  );

  return stageRows;
};

export default buildStageRows;
