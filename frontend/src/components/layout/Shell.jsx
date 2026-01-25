import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

import icon from "../../assets/icon.png";
import logo from "../../assets/logo.png";
import { dashboardData } from "../../data/dashboardData.js";
import { useTenders } from "../../context/TenderContext.jsx";
import "../../styles/shell.css";

const Shell = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { selectedYear, setSelectedYear } = useTenders();
  const yearOptions = useMemo(
    () => Object.keys(dashboardData.years).sort(),
    []
  );
  const safeYear = yearOptions.includes(selectedYear)
    ? selectedYear
    : yearOptions[yearOptions.length - 1];

  useEffect(() => {
    if (safeYear !== selectedYear) {
      setSelectedYear(safeYear);
    }
  }, [safeYear, selectedYear, setSelectedYear]);

  return (
    <div className={`app-shell${collapsed ? " sidebar-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <img src={icon} alt="KPMOG icon" className="sidebar-icon" />
            <img src={logo} alt="KPMOG logo" className="sidebar-logo" />
          </div>
          <button
            type="button"
            className="icon-button sidebar-toggle"
            onClick={() => setCollapsed((value) => !value)}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <i
              className={`fa-solid ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`}
              aria-hidden="true"
            />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-item${isActive ? " active" : ""}`
            }
          >
            <i className="fa-solid fa-gauge-high" aria-hidden="true" />
            <span className="sidebar-label">Dashboard</span>
          </NavLink>
          <NavLink
            to="/tenders"
            className={({ isActive }) =>
              `nav-item${isActive ? " active" : ""}`
            }
          >
            <i className="fa-solid fa-list-check" aria-hidden="true" />
            <span className="sidebar-label">Tender Lists</span>
          </NavLink>
          <NavLink
            to="/pipeline"
            className={({ isActive }) =>
              `nav-item${isActive ? " active" : ""}`
            }
          >
            <i className="fa-solid fa-filter" aria-hidden="true" />
            <span className="sidebar-label">Pipeline</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <div className="title-block">
              <h1>BUSINESS DEVELOPMENT DEPARTMENT</h1>
              <p>Tender Monitoring</p>
            </div>
          </div>

          <div className="topbar-right">
            <select
              className="year-select"
              aria-label="Select year"
              value={safeYear}
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="avatar-circle" aria-hidden="true">
              <i className="fa-regular fa-user" />
            </div>
          </div>
        </header>

        <section className="main-content">{children}</section>
      </main>
    </div>
  );
};

export default Shell;
