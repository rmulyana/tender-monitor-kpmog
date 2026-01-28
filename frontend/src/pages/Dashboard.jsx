import CurrencyControls from "./Dashboard/CurrencyControls.jsx";
import TargetModal from "./Dashboard/components/TargetModal.jsx";
import RecentTendersTable from "./Dashboard/components/RecentTendersTable.jsx";
import ProcessChart from "./Dashboard/components/ProcessChart.jsx";
import StageFlowChart from "./Dashboard/components/StageFlowChart.jsx";
import ContractValueChart from "./Dashboard/components/ContractValueChart.jsx";
import useDashboardData from "./Dashboard/hooks/useDashboardData.js";
import { formatCurrencyCompact } from "../utils/formatters.js";
import "../styles/dashboard.css";

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
    <div className="dashboard-layout">
      {rateToast ? (
        <div className="rate-toast" role="status">
          {rateToast}
        </div>
      ) : null}
      <section className="panel summary-panel">
        <div className="panel-title-group">
          <h2 className="panel-title">Tender Active Summary</h2>
          <CurrencyControls
            displayCurrency={displayCurrency}
            onCurrencyChange={handleCurrencyChange}
            onUpdateRate={handleUpdateRate}
            isRateLoading={isRateLoading}
          />
        </div>
        <div className="summary-scroll">
          <div className="summary-grid">
            {summaryColumns.map((column) => (
              <div key={column.key} className="summary-column">
                <h3>{column.title}</h3>
                <div className="summary-rows">
                  {column.rows.map((row, index) => {
                    const palette = rowPalette[index] || rowPalette[0];
                    return (
                      <div key={row.label} className="summary-row">
                        <span>{row.label}</span>
                        <span
                          className="row-value"
                          style={{ color: palette.text }}
                        >
                          {row.value}
                        </span>
                        <div className="row-bar">
                          <span
                            style={{
                              width: `${row.percent}%`,
                              background: palette.bar,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="summary-footer">
                  <p>{column.valueLabel}</p>
                  <span
                    title={formatFullCurrency(
                      column.totalValue,
                      displayCurrency,
                    )}
                    className="summary-value"
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

      <section className="dashboard-grid">
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
        displayCurrency={displayCurrency}
        usdToIdrRate={usdToIdrRate}
        convertValue={convertValue}
        formatCurrencyCode={formatCurrencyCode}
      />
    </div>
  );
};

export default Dashboard;
