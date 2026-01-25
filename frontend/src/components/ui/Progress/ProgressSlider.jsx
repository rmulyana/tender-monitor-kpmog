const ProgressSlider = ({ value, color, onChange }) => {
  return (
    <div className="progress-slider">
      <div
        className="progress-slider-track"
        style={{ "--progress": `${value}%`, "--progress-color": color }}
      >
        <input
          className="progress-slider-input"
          type="range"
          min="0"
          max="100"
          step="5"
          value={value}
          onChange={onChange}
        />
        <span className="progress-slider-value">{value}%</span>
      </div>
    </div>
  );
};

export default ProgressSlider;
