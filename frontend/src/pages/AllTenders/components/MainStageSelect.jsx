import { STAGES, stageClassName } from "../../../utils/tenderUtils.js";

const MainStageSelect = ({ value, onChange, onBlur, isLocked = false }) => {
  return (
    <select
      className={`main-stage-select ${stageClassName(value)}${
        isLocked ? " is-locked" : ""
      }`.trim()}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={isLocked}
    >
      {STAGES.map((stage) => (
        <option key={stage.name} value={stage.name}>
          {stage.name}
        </option>
      ))}
    </select>
  );
};

export default MainStageSelect;
