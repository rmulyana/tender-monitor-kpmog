// /Users/ruzia/Developer/mern/tender-monitor/frontend/src/components/dashboard/CurrencyControls.jsx
import { RefreshCw } from "lucide-react";

const CurrencyControls = ({
  displayCurrency,
  onCurrencyChange,
  onUpdateRate,
  isRateLoading,
}) => (
  <div className="currency-controls">
    <select
      className="panel-select currency-select"
      aria-label="Select currency"
      value={displayCurrency}
      onChange={onCurrencyChange}
    >
      <option value="IDR">IDR</option>
      <option value="USD">USD</option>
    </select>
    <button
      type="button"
      className="icon-button"
      aria-label="Update exchange rate"
      onClick={onUpdateRate}
      disabled={isRateLoading}
    >
      <RefreshCw
        size={16}
        className={isRateLoading ? "animate-spin-slow" : ""}
      />
    </button>
  </div>
);

export default CurrencyControls;
