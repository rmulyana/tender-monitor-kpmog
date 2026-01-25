import { STAGES, stageClassName } from "../../../utils/tenderUtils.js";

const MainStageSelect = ({ value, onChange, onBlur }) => {
  return (
    <select
      className={`main-stage-select ${stageClassName(value)}`.trim()}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
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
