const ProgressSlider = ({ value, color, onChange }) => {
  return (
    <div className="relative h-4 w-full rounded-full bg-slate-200">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, background: color }}
      />
      <input
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        type="range"
        min="0"
        max="100"
        step="5"
        value={value}
        onChange={onChange}
      />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[0.65rem] font-semibold text-slate-700">
        {value}%
      </span>
    </div>
  );
};

export default ProgressSlider;
