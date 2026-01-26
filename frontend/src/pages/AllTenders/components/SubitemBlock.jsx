import { Fragment } from "react";

import buildStageRows from "./buildStageRows.jsx";

const SubitemBlock = ({
  tender,
  isExpanded,
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
  if (!isExpanded) return null;

  const stageRows = buildStageRows({
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
  });

  return (
    <Fragment>
      <tr className="gap-row">
        <td colSpan={11} />
      </tr>
      <tr id={`subitems-${tender.id}`} className="subhead-row block-start">
        <td className="w-pin sticky tree-empty" />
        <td className="w-title sticky2 divider-shadow wraptext tree-box tree-box-first">
          Subitem
        </td>
        <td className="w-client tree-box">Status</td>
        <td className="w-cons tree-box">PIC</td>
        <td className="w-stage tree-box">Submission</td>
        <td className="w-status tree-box">Attachment</td>
        <td className="w-date tree-box">Progress</td>
        <td className="w-priority tree-box">Priority</td>
        <td className="w-timeline tree-box">Timeline</td>
        <td className="w-remarks tree-box tree-box-last notes-cell" colSpan={2}>
          Notes
        </td>
      </tr>
      {stageRows}
      <tr className="sep-row">
        <td colSpan={11} />
      </tr>
    </Fragment>
  );
};

export default SubitemBlock;
