import { ChevronDown, ChevronRight } from "lucide-react";
import { formatDate } from "../../../utils/formatters.js";

const ContractSignedTable = ({
  items,
  title = "Awarded Project",
  emptyLabel = "No contract signed project",
  isOpen = false,
  onToggle,
  displayCurrency,
  usdToIdrRate,
  convertValue,
  formatCurrencyCode,
}) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
    <header className="mb-3 flex min-h-[40px] items-center justify-between gap-3 border-b border-indigo-100 pb-2.5">
      <button
        type="button"
        className="group inline-flex cursor-pointer items-center gap-2 text-left text-[0.75rem] font-bold uppercase tracking-[0.12em] text-slate-800"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={`${isOpen ? "Collapse" : "Expand"} ${title}`}
      >
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-slate-500" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-500" aria-hidden="true" />
        )}
        <span className="group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
          {title}
        </span>
      </button>
    </header>
    <div className={`mt-4 overflow-x-auto ${isOpen ? "block" : "hidden"}`}>
      <table className="w-full table-fixed border-collapse text-[0.7rem]">
        <thead>
          <tr>
            <th className="w-[34%] border-b border-slate-100 px-4 py-3 text-left text-[0.7rem] uppercase tracking-[0.12em] text-slate-800">
              Project Title
            </th>
            <th className="w-[20%] border-b border-slate-100 px-4 py-3 text-left text-[0.7rem] uppercase tracking-[0.12em] text-slate-800">
              Client
            </th>
            <th className="w-[16%] border-b border-slate-100 px-4 py-3 text-left text-[0.7rem] uppercase tracking-[0.12em] text-slate-800">
              Location
            </th>
            <th className="w-[14%] border-b border-slate-100 px-4 py-3 text-left text-[0.7rem] uppercase tracking-[0.12em] text-slate-800">
              Contract Date
            </th>
            <th className="w-[16%] border-b border-slate-100 px-4 py-3 text-left text-[0.7rem] uppercase tracking-[0.12em] text-slate-800">
              Contract Value
            </th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="border-b border-slate-100 px-4 py-4 text-center text-[0.75rem] font-semibold text-slate-500"
              >
                {emptyLabel}
              </td>
            </tr>
          ) : (
            items.map((tender) => (
              <tr key={tender.id} className="group hover:bg-orange-200/20">
                <td className="relative border-b border-slate-100 px-4 py-3 text-left">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-full w-1 bg-orange-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  />
                  <div className="font-semibold text-slate-900">
                    {tender.projectTitle}
                  </div>
                  <span className="text-[0.75rem] text-slate-400">
                    {tender.pin}
                  </span>
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-left">
                  {tender.client}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-left">
                  {tender.location}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-left">
                  {formatDate(tender.dueDate)}
                </td>
                <td className="border-b border-slate-100 px-4 py-3 text-left">
                  {(() => {
                    const normalizedValue = Number(tender.estValue || 0);
                    if (
                      !Number.isFinite(normalizedValue) ||
                      normalizedValue <= 0
                    ) {
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);

export default ContractSignedTable;
