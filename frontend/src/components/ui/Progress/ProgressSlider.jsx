const ProgressSlider = ({ value, color, onChange }) => {
  return (
    <div className="progress-slider">
      <div className="progress-slider-track">
        <input
          className="progress-slider-input"
          type="range"
          min="0"
          max="100"
          step="5"
          value={value}
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`,
          }}
          onChange={onChange}
        />
        <span className="progress-slider-value">{value}%</span>
      </div>
    </div>
  );
};

export default ProgressSlider;
