// /Users/ruzia/Developer/mern/tender-monitor/frontend/src/components/dashboard/CurrencyControls.jsx
import { RefreshCw } from "lucide-react";

const CurrencyControls = ({
  displayCurrency,
  onCurrencyChange,
  onUpdateRate,
  isRateLoading,
}) => (
  <div className="flex items-center gap-2">
    <select
      className="min-w-[70px] cursor-pointer rounded-full border border-slate-200 bg-white px-2 py-1 text-[0.7rem] font-semibold text-slate-600 transition hover:border-orange-400"
      aria-label="Select currency"
      value={displayCurrency}
      onChange={onCurrencyChange}
    >
      <option value="IDR">IDR</option>
      <option value="USD">USD</option>
    </select>
    <button
      type="button"
      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-orange-400 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Update exchange rate"
      onClick={onUpdateRate}
      disabled={isRateLoading}
    >
      <RefreshCw
        size={16}
        className={isRateLoading ? "animate-spin" : ""}
      />
    </button>
  </div>
);

export default CurrencyControls;
