import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const ProcessChart = ({
  labels,
  selectedMonth,
  onMonthChange,
  donutConfig,
  donutCenterStyle,
  processData,
  processTotal,
  CustomTooltip,
}) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
    <header className="mb-3 flex min-h-[40px] items-center justify-between gap-3 border-b border-indigo-100 pb-2.5">
      <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-indigo-900">
        Tender Process Chart
      </h2>
      <select
        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-600"
        aria-label="Select month"
        value={selectedMonth}
        onChange={(event) => onMonthChange(event.target.value)}
      >
        {labels.map((label) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
    </header>
    <div className="mt-1 grid gap-5 md:grid-cols-[minmax(0,1fr)_160px] md:items-center">
      <div className="relative w-full">
        <ResponsiveContainer
          width="100%"
          height={donutConfig.outerRadius * 2 + donutConfig.padding * 2}
        >
          <PieChart>
            <Pie
              data={processData}
              dataKey="value"
              nameKey="name"
              innerRadius={donutConfig.innerRadius}
              outerRadius={donutConfig.outerRadius}
              cx={donutConfig.outerRadius + donutConfig.padding}
              cy={donutConfig.outerRadius + donutConfig.padding}
              paddingAngle={0}
              stroke="#ffffff"
              strokeWidth={2}
              cornerRadius={0}
              label={false}
            >
              {processData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={(props) => <CustomTooltip {...props} />}
              wrapperStyle={{ zIndex: 1000 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div
          className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center"
          style={donutCenterStyle}
          aria-hidden="true"
        >
          <span className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Total
          </span>
          <span className="text-[4.25rem] font-bold leading-none text-slate-900">
            {processTotal}
          </span>
        </div>
      </div>
      <ul className="grid gap-2.5 text-[0.72rem] font-medium text-slate-500">
        {processData.map((item) => (
          <li key={item.name} className="flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 rounded-full"
              style={{ background: item.color }}
            />
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  </article>
);

export default ProcessChart;
