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
    isNested: true,
  });

  return (
    <Fragment>
      <tr className="h-3">
        <td colSpan={10} />
      </tr>
      <tr id={`subitems-${tender.id}`}>
        <td colSpan={10} className="bg-white px-0">
          <div className="ml-[72px] w-[calc(100%-72px)] rounded-2xl border border-slate-200 bg-white">
            <table className="w-full border-collapse text-[0.7rem] text-slate-700">
              <thead className="bg-slate-50">
                <tr>
                  <td className="sticky left-[72px] z-30 w-[260px] min-w-[260px] max-w-[260px] rounded-tl-2xl bg-slate-50 px-4 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-800">
                    Activity
                  </td>
                  <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-800">
                    Status
                  </td>
                  <td className="w-[120px] min-w-[120px] max-w-[120px] px-3 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-800">
                    PIC
                  </td>
                  <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-800">
                    Submission
                  </td>
                  <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-800">
                    Attachment
                  </td>
                  <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-800">
                    Progress
                  </td>
                  <td className="w-[150px] min-w-[150px] max-w-[150px] px-3 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-800">
                    Priority
                  </td>
                  <td className="w-[200px] min-w-[200px] max-w-[200px] px-3 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-800">
                    Timeline
                  </td>
                  <td
                    className="w-[170px] min-w-[170px] max-w-[170px] rounded-tr-2xl px-3 py-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-slate-800"
                    colSpan={2}
                  >
                    Notes
                  </td>
                </tr>
              </thead>
              <tbody>{stageRows}</tbody>
            </table>
          </div>
        </td>
      </tr>
      <tr className="h-3">
        <td colSpan={10} />
      </tr>
    </Fragment>
  );
};

export default SubitemBlock;
