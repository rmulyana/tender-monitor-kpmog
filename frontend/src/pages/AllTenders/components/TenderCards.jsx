import StagePill from "../../../components/tenders/StagePill.jsx";
import StatusBadge from "../../../components/tenders/StatusBadge.jsx";
import TenderTimeline from "../../../components/ui/Timeline/TenderTimeline.jsx";
import {
  formatCurrency,
  formatDate,
} from "../../../utils/formatters.js";

const TenderCards = ({ tenders }) => (
  <section className="space-y-4">
    {tenders.map((tender) => (
      <article
        key={tender.id}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              {tender.pin}
            </span>
            <h3 className="mt-2 text-xs font-semibold uppercase text-slate-900">
              {tender.projectTitle}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {tender.client} - {tender.location}
            </p>
          </div>
          <StatusBadge status={tender.status} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-700">
          <StagePill stage={tender.stage} />
          <span className="font-medium">
            {formatCurrency(tender.estValue, tender.currency)}
          </span>
          <span className="text-slate-500">{formatDate(tender.dueDate)}</span>
        </div>
        <div className="mt-3">
          <TenderTimeline
            startDate={tender.startDate}
            dueDate={tender.dueDate}
            overdueDays={tender.overdueDays}
          />
        </div>
        {tender.remarks ? (
          <p className="mt-2 text-xs text-slate-500">{tender.remarks}</p>
        ) : null}
      </article>
    ))}
  </section>
);

export default TenderCards;
