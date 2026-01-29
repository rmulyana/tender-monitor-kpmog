import StagePill from "../../../components/tenders/StagePill.jsx";
import { formatDate } from "../../../utils/formatters.js";

const RecentTendersTable = ({
  items,
  title = "Recent Active Tenders",
  emptyLabel = "No recent active tender",
  useDueStatus = true,
  displayCurrency,
  usdToIdrRate,
  convertValue,
  formatCurrencyCode,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
    <header className="mb-3 flex min-h-[40px] items-center justify-between gap-3 border-b border-indigo-100 pb-2.5">
      <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-indigo-900">
        {title}
      </h2>
    </header>
    <div className="mt-4 overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-[0.82rem]">
        <thead>
          <tr>
            <th className="w-[30%] border-b border-slate-100 px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.12em] text-slate-400">
              Project Title
            </th>
            <th className="w-[22%] border-b border-slate-100 px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.12em] text-slate-400">
              Client
            </th>
            <th className="border-b border-slate-100 px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.12em] text-slate-400">
              Estimated Value
            </th>
            <th className="w-[12%] border-b border-slate-100 px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.12em] text-slate-400">
              Due Date
            </th>
            <th className="w-[16%] border-b border-slate-100 px-4 py-3 text-left text-[0.62rem] uppercase tracking-[0.12em] text-slate-400">
              Stage
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="border-b border-slate-100 px-4 py-4 text-center text-sm font-semibold text-slate-500"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            items.map((tender) => (
              <tr
                key={tender.id}
                className={[
                  "group",
                  useDueStatus && tender.dueStatus === "warn"
                    ? "bg-amber-200/15 hover:bg-amber-200/25"
                    : "",
                  useDueStatus && tender.dueStatus === "urgent"
                    ? "bg-rose-200/15 hover:bg-rose-200/25"
                    : "",
                  !useDueStatus || tender.dueStatus === "ok"
                    ? "hover:bg-orange-200/20"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <td className="border-b border-slate-100 px-4 py-3 text-left">
                  <div className="font-semibold text-slate-900">
                    {tender.projectTitle}
                  </div>
                  <span className="text-sm text-slate-400">{tender.pin}</span>
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-left">
                  {tender.client}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-left">
                  {(() => {
                    const normalizedValue = Number(tender.estValue || 0);
                    if (!Number.isFinite(normalizedValue) || normalizedValue <= 0) {
                      return "N/A";
                    }
                    return formatCurrencyCode(
                      convertValue(
                        tender.estValue,
                        tender.currency,
                        displayCurrency,
                        usdToIdrRate,
                      ),
                      displayCurrency,
                    );
                  })()}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-left">
                  <div>{formatDate(tender.dueDate)}</div>
                  <div className="mt-1 text-[0.7rem] text-slate-400">
                    {tender.dueInLabel}
                  </div>
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-left">
                  <StagePill stage={tender.stage} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default RecentTendersTable;
