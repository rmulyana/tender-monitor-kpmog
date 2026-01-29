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
  <section className="panel">
    <header className="panel-header">
      <h2 className="panel-title">{title}</h2>
    </header>
    <div className="table-wrap">
      <table className="recent-table">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Client</th>
            <th>Estimated Value</th>
            <th>Due Date</th>
            <th>Stage</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr className="recent-row-empty">
              <td colSpan={5}>{emptyLabel}</td>
            </tr>
          ) : (
            items.map((tender) => (
              <tr
                key={tender.id}
                className={`recent-row${useDueStatus ? ` recent-row-${tender.dueStatus}` : ""}`}
              >
                <td>
                  <div className="title-cell">{tender.projectTitle}</div>
                  <span className="pin-cell">{tender.pin}</span>
                </td>
                <td>{tender.client}</td>
                <td>
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
                <td>
                  <div>{formatDate(tender.dueDate)}</div>
                  <div className="recent-duein">{tender.dueInLabel}</div>
                </td>
                <td className="recent-stage-cell">
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
