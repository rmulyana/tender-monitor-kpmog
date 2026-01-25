import StagePill from "../../../components/tenders/StagePill.jsx";
import StatusBadge from "../../../components/tenders/StatusBadge.jsx";
import TenderTimeline from "../../../components/ui/Timeline/TenderTimeline.jsx";
import {
  formatCurrency,
  formatDate,
} from "../../../utils/formatters.js";

const TenderCards = ({ tenders }) => (
  <section className="tender-cards">
    {tenders.map((tender) => (
      <article key={tender.id} className="tender-card">
        <div className="tender-card-header">
          <div>
            <span className="pin-label">{tender.pin}</span>
            <h3>{tender.projectTitle}</h3>
            <p>
              {tender.client} - {tender.location}
            </p>
          </div>
          <StatusBadge status={tender.status} />
        </div>
        <div className="tender-card-meta">
          <StagePill stage={tender.stage} />
          <span className="value-inline">
            {formatCurrency(tender.estValue, tender.currency)}
          </span>
          <span className="date-inline">{formatDate(tender.dueDate)}</span>
        </div>
        <TenderTimeline
          startDate={tender.startDate}
          dueDate={tender.dueDate}
          overdueDays={tender.overdueDays}
        />
        <p className="remarks-inline">{tender.remarks}</p>
      </article>
    ))}
  </section>
);

export default TenderCards;
