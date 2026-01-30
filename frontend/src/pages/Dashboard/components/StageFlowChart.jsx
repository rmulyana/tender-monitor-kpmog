import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const StageFlowChart = ({
  labels,
  selectedMonth,
  onMonthChange,
  data,
  chartColors,
  stageLegend,
  CustomTooltip,
}) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
    <header className="mb-3 flex min-h-[40px] items-center justify-between gap-3 pb-2.5">
      <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-indigo-900">
        Monthly Stage Flow
      </h2>
      <select
        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-[0.75rem] font-semibold text-slate-600 transition hover:border-orange-400"
        aria-label="Select month for monthly stage flow"
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
    <div className="mt-3">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 12, left: -10, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: "0.75rem" }} />
          <YAxis allowDecimals={false} tick={{ fontSize: "0.75rem" }} />
          <Tooltip
            content={(props) => <CustomTooltip {...props} />}
            labelFormatter={(label, payload) => {
              const total = (payload || []).reduce(
                (sum, entry) => sum + (Number(entry.value) || 0),
                0,
              );
              return `${label} : ${total} Tenders`;
            }}
          />
          <Bar
            dataKey="Registration"
            stackId="a"
            fill={chartColors.Registration}
            name="Registration"
          />
          <Bar
            dataKey="PreQualification"
            stackId="a"
            fill={chartColors["Pre-Qualification"]}
            name="Pre-Qualification"
          />
          <Bar dataKey="Proposal" stackId="a" fill={chartColors.Proposal} name="Proposal" />
          <Bar
            dataKey="Negotiation"
            stackId="a"
            fill={chartColors.Negotiation}
            name="Negotiation"
          />
          <Bar dataKey="Contract" stackId="a" fill={chartColors.Contract} name="Contract" />
          <Bar dataKey="Failed" stackId="a" fill={chartColors.Failed} name="Failed" />
        </BarChart>
      </ResponsiveContainer>
      <div
        className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.7rem] font-medium text-slate-500"
        aria-hidden="true"
      >
        {stageLegend.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span
              className="h-3.5 w-3.5 rounded-full"
              style={{ background: item.color }}
            />
            {item.value}
          </div>
        ))}
      </div>
    </div>
  </article>
);

export default StageFlowChart;
