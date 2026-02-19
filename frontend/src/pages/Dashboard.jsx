import CurrencyControls from "./Dashboard/CurrencyControls.jsx";
import TargetModal from "./Dashboard/components/TargetModal.jsx";
import RecentTendersTable from "./Dashboard/components/RecentTendersTable.jsx";
import ProcessChart from "./Dashboard/components/ProcessChart.jsx";
import StageFlowChart from "./Dashboard/components/StageFlowChart.jsx";
import ContractValueChart from "./Dashboard/components/ContractValueChart.jsx";
import useDashboardData from "./Dashboard/hooks/useDashboardData.js";
import { formatCurrencyCompact } from "../utils/formatters.js";

import {
  MONTH_LABELS,
  FULL_MONTH_LABELS,
  chartColors,
  summaryPillColors,
  rowPalette,
  tooltipSurfaceStyle,
  tooltipLabelStyle,
  tooltipListStyle,
  CustomTooltip,
  donutConfig,
  contractLegendItems,
  donutCenterStyle,
  formatChartValue,
  formatCurrencyCode,
  convertValue,
  formatFullCurrency,
} from "./Dashboard/utils/dashboardHelpers.jsx";

const Dashboard = () => {
  const {
    labels,
    selectedYear,
    displayCurrency,
    setDisplayCurrency,
    usdToIdrRate,
    handleUpdateRate,
    isRateLoading,
    rateToast,
    summaryColumns,
    processData,
    processTotal,
    monthlyStageFlowVisible,
    stageLegend,
    contractValueData,
    contractValueVisible,
    activeTargetLabel,
    recentTenders,
    outstandingTenders,
    timelineYear,
    selectedMonth,
    setSelectedMonth,
    isTargetLoading,
    isTargetSaving,
    isTargetModalOpen,
    setIsTargetModalOpen,
    targetInputRaw,
    setTargetInputRaw,
    handleTargetEdit,
    handleTargetSave,
  } = useDashboardData();

  const handleCurrencyChange = (event) => {
    setDisplayCurrency(event.target.value);
  };

  return (
    <div className="grid gap-6">
      {rateToast ? (
        <div
          className="fixed right-6 top-4 z-[1400] rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-[0.75rem] font-semibold text-slate-50 shadow-[0_12px_30px_rgba(15,23,42,0.35)]"
          role="status"
        >
          {rateToast}
        </div>
      ) : null}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-4 pb-2">
          <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.12em] text-indigo-900">
            Tender Active Summary
          </h2>
          <CurrencyControls
            displayCurrency={displayCurrency}
            onCurrencyChange={handleCurrencyChange}
            onUpdateRate={handleUpdateRate}
            isRateLoading={isRateLoading}
          />
        </div>
        <div className="mt-4 overflow-x-auto">
          <div className="grid min-w-[1000px] grid-cols-6">
            {summaryColumns.map((column) => (
              <div
                key={column.key}
                className="flex min-h-[260px] flex-col border-r border-slate-200 px-3 last:border-r-0"
              >
                <h3 className="mb-3 mt-3 pb-1.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-indigo-900">
                  {column.title}
                </h3>
                <div className="grid gap-2.5">
                  {column.rows.map((row, index) => {
                    const palette = rowPalette[index] || rowPalette[0];
                    return (
                      <div
                        key={row.label}
                        className="grid grid-cols-[1fr_auto] gap-1 text-[0.7rem] text-slate-500"
                      >
                        <span>{row.label}</span>
                        <span
                          className="font-bold"
                          style={{ color: palette.text }}
                        >
                          {row.value}
                        </span>
                        <div className="col-span-full h-1.5 overflow-hidden rounded-full bg-slate-100/70">
                          <span
                            style={{
                              width: `${row.percent}%`,
                              background: palette.bar,
                            }}
                            className="block h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-auto border-t border-slate-200 pt-2 text-center">
                  <p className="mb-1 text-[0.7rem] uppercase tracking-[0.14em] text-slate-400">
                    {column.valueLabel}
                  </p>
                  <span
                    title={formatFullCurrency(
                      column.totalValue,
                      displayCurrency,
                    )}
                    className="inline-block rounded-md border border-transparent px-2.5 py-1 text-[0.7rem] font-bold"
                    style={{
                      color: summaryPillColors[column.key]?.text,
                      background: summaryPillColors[column.key]?.bg,
                      borderColor: summaryPillColors[column.key]?.border,
                    }}
                  >
                    {formatCurrencyCompact(column.totalValue, displayCurrency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
        <ProcessChart
          labels={labels}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          donutConfig={donutConfig}
          donutCenterStyle={donutCenterStyle}
          processData={processData}
          processTotal={processTotal}
          CustomTooltip={CustomTooltip}
        />
        <StageFlowChart
          labels={labels}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          data={monthlyStageFlowVisible}
          chartColors={chartColors}
          stageLegend={stageLegend}
          CustomTooltip={CustomTooltip}
        />
      </section>

      <ContractValueChart
        selectedYear={selectedYear}
        activeTargetLabel={activeTargetLabel}
        labels={labels}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        onTargetEdit={handleTargetEdit}
        isTargetLoading={isTargetLoading}
        isTargetSaving={isTargetSaving}
        data={contractValueVisible}
        contractValueData={contractValueData}
        displayCurrency={displayCurrency}
        MONTH_LABELS={MONTH_LABELS}
        FULL_MONTH_LABELS={FULL_MONTH_LABELS}
        formatChartValue={formatChartValue}
        formatFullCurrency={formatFullCurrency}
        tooltipSurfaceStyle={tooltipSurfaceStyle}
        tooltipLabelStyle={tooltipLabelStyle}
        tooltipListStyle={tooltipListStyle}
        contractLegendItems={contractLegendItems}
      />

      <TargetModal
        isOpen={isTargetModalOpen}
        year={timelineYear}
        valueRaw={targetInputRaw}
        isSaving={isTargetSaving}
        onChangeRaw={setTargetInputRaw}
        onClose={() => setIsTargetModalOpen(false)}
        onSubmit={handleTargetSave}
      />

      <RecentTendersTable
        items={recentTenders}
        title="Recent Active Tenders"
        emptyLabel="No recent active tender"
        useDueStatus
        displayCurrency={displayCurrency}
        usdToIdrRate={usdToIdrRate}
        convertValue={convertValue}
        formatCurrencyCode={formatCurrencyCode}
      />

      <RecentTendersTable
        items={outstandingTenders}
        title="Outstanding Tenders"
        emptyLabel="No outstanding tender"
        useDueStatus={false}
        displayCurrency={displayCurrency}
        usdToIdrRate={usdToIdrRate}
        convertValue={convertValue}
        formatCurrencyCode={formatCurrencyCode}
      />
    </div>
  );
};

export default Dashboard;
