import { useMemo, useState } from "react";
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
}) => {
  const [disabledLegend, setDisabledLegend] = useState(() => new Set());

  const toggleLegend = (id) => {
    setDisabledLegend((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const legendItems = useMemo(
    () =>
      stageLegend.map((item) => ({
        ...item,
        dataKey: item.id === "Pre-Qualification" ? "PreQualification" : item.id,
      })),
    [stageLegend],
  );

  const filteredData = useMemo(() => {
    if (disabledLegend.size === 0) return data;
    return data.map((row) => {
      const nextRow = { ...row };
      legendItems.forEach((item) => {
        if (disabledLegend.has(item.id)) {
          nextRow[item.dataKey] = 0;
        }
      });
      return nextRow;
    });
  }, [data, disabledLegend, legendItems]);

  const activeLegendIds = useMemo(
    () =>
      legendItems
        .filter((item) => !disabledLegend.has(item.id))
        .map((item) => item.dataKey),
    [legendItems, disabledLegend],
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
      <header className="mb-3 flex min-h-[40px] items-center justify-between gap-3 pb-2.5">
        <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-indigo-900">
          Monthly Stage Flow
        </h2>
        <select
        className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-[0.75rem] font-semibold text-slate-600 outline-none transition hover:border-orange-400 focus:border-slate-200 focus:hover:border-orange-400"
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
          <BarChart data={filteredData} margin={{ top: 4, right: 12, left: -10, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: "0.75rem" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: "0.75rem" }} />
            <Tooltip
              content={(props) => <CustomTooltip {...props} />}
              labelFormatter={(label, payload) => {
                const filteredPayload = (payload || []).filter((entry) =>
                  activeLegendIds.includes(entry.dataKey),
                );
                const total = filteredPayload.reduce(
                  (sum, entry) => sum + (Number(entry.value) || 0),
                  0,
                );
                return `${label} : ${total} Tenders`;
              }}
            />
            {legendItems.map((item) =>
              disabledLegend.has(item.id) ? null : (
                <Bar
                  key={item.id}
                  dataKey={item.dataKey}
                  stackId="a"
                  fill={item.color}
                  name={item.value}
                  isAnimationActive
                  animationDuration={1000}
                  animationBegin={0}
                  animationEasing="cubic-bezier(0.34, 1.56, 0.64, 1)"
                />
              ),
            )}
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[0.7rem] font-medium text-slate-500">
          {legendItems.map((item) => {
            const isDisabled = disabledLegend.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleLegend(item.id)}
                className={[
                  "flex items-center gap-2 rounded-md text-left transition",
                  "hover:text-slate-700",
                  isDisabled ? "opacity-50" : "",
                ].join(" ")}
                aria-pressed={!isDisabled}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ background: item.color }}
                />
                <span className={isDisabled ? "line-through" : ""}>
                  {item.value}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
};

export default StageFlowChart;
