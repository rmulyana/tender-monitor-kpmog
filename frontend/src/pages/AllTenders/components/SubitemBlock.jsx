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
      <tr className="h-3">
        <td colSpan={11} />
      </tr>
      <tr id={`subitems-${tender.id}`} className="bg-slate-50">
        <td className="sticky left-0 z-30 w-[72px] min-w-[72px] max-w-[72px] bg-slate-50 px-3 py-2" />
        <td className="sticky left-[72px] z-20 w-[260px] min-w-[260px] max-w-[260px] bg-slate-50 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Subitem
        </td>
        <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Status
        </td>
        <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
          PIC
        </td>
        <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Submission
        </td>
        <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Attachment
        </td>
        <td className="w-[100px] min-w-[100px] max-w-[100px] px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Progress
        </td>
        <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Priority
        </td>
        <td className="w-[200px] min-w-[200px] max-w-[200px] px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Timeline
        </td>
        <td
          className="w-[170px] min-w-[170px] max-w-[170px] px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400"
          colSpan={2}
        >
          Notes
        </td>
      </tr>
      {stageRows}
      <tr className="h-3">
        <td colSpan={11} />
      </tr>
    </Fragment>
  );
};

export default SubitemBlock;
