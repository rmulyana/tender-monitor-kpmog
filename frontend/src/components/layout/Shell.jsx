import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import brandLogo from "../../assets/KPMOG.png";
import { useTenders } from "../../context/TenderContext.jsx";

const Shell = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { selectedYear, setSelectedYear, yearOptions } = useTenders();
  const safeYear = yearOptions.includes(selectedYear)
    ? selectedYear
    : yearOptions[yearOptions.length - 1] || selectedYear;

  useEffect(() => {
    if (safeYear !== selectedYear) {
      setSelectedYear(safeYear);
    }
  }, [safeYear, selectedYear, setSelectedYear]);

  return (
    <div className="flex h-full overflow-hidden bg-[var(--bg)]">
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      ) : null}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-[var(--sidebar-bg)] text-white",
          "transition-[width,transform] duration-200 ease-in-out",
          "w-64 -translate-x-full sm:static sm:translate-x-0",
          mobileOpen ? "translate-x-0" : "",
          collapsed ? "sm:w-20" : "sm:w-64",
          "sm:border-r sm:border-white/10",
        ].join(" ")}
      >
        <div
          className={[
            "relative flex h-16 items-center bg-[var(--sidebar-top)] px-3 transition-all duration-200 ease-in-out",
            collapsed ? "justify-center" : "justify-between gap-3",
          ].join(" ")}
        >
          {collapsed ? (
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg text-slate-200 transition hover:bg-[var(--orange-400)] hover:text-white"
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <i className="fa-solid fa-bars" aria-hidden="true" />
            </button>
          ) : (
            <>
              <img
                src={brandLogo}
                alt="KPMOG logo"
                className="h-[44px] w-auto max-w-[190px] object-contain"
              />
              <button
                type="button"
                className="ml-auto grid h-9 w-9 place-items-center rounded-lg text-slate-200 transition hover:bg-[var(--orange-400)] hover:text-white"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <i className="fa-solid fa-bars" aria-hidden="true" />
              </button>
            </>
          )}
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-lg text-slate-200 transition hover:bg-white/10 sm:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 py-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              [
                "group relative flex h-14 items-center text-slate-300 transition",
                collapsed
                  ? "justify-center w-full px-0 hover:bg-[var(--orange-400)] hover:text-white hover:after:absolute hover:after:left-0 hover:after:top-0 hover:after:h-full hover:after:w-1 hover:after:bg-orange-500"
                  : "gap-3 px-6 hover:bg-[var(--orange-400)] hover:text-white hover:after:absolute hover:after:left-0 hover:after:top-0 hover:after:h-full hover:after:w-1 hover:after:bg-orange-500",
                isActive
                  ? "bg-orange-500/30 text-white relative after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-orange-500"
                  : "",
              ].join(" ")
            }
          >
            <span className="flex h-6 w-6 items-center justify-center">
              <i className="fa-solid fa-gauge-high" aria-hidden="true" />
            </span>
            <span
              className={[
                "font-medium transition-all duration-200 ease-in-out",
                collapsed ? "max-w-0 overflow-hidden opacity-0" : "opacity-100",
              ].join(" ")}
            >
              Dashboard
            </span>
            {collapsed ? (
              <span className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white shadow-lg group-hover:flex">
                Dashboard
              </span>
            ) : null}
          </NavLink>
          <NavLink
            to="/tenders"
            className={({ isActive }) =>
              [
                "group relative flex h-14 items-center text-slate-300 transition",
                collapsed
                  ? "justify-center w-full px-0 hover:bg-[var(--orange-400)] hover:text-white hover:after:absolute hover:after:left-0 hover:after:top-0 hover:after:h-full hover:after:w-1 hover:after:bg-orange-500"
                  : "gap-3 px-6 hover:bg-[var(--orange-400)] hover:text-white hover:after:absolute hover:after:left-0 hover:after:top-0 hover:after:h-full hover:after:w-1 hover:after:bg-orange-500",
                isActive
                  ? "bg-orange-500/30 text-white relative after:absolute after:left-0 after:top-0 after:h-full after:w-1 after:bg-orange-500"
                  : "",
              ].join(" ")
            }
          >
            <span className="flex h-6 w-6 items-center justify-center">
              <i className="fa-solid fa-list-check" aria-hidden="true" />
            </span>
            <span
              className={[
                "font-medium transition-all duration-200 ease-in-out",
                collapsed ? "max-w-0 overflow-hidden opacity-0" : "opacity-100",
              ].join(" ")}
            >
              Tender Lists
            </span>
            {collapsed ? (
              <span className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1 text-sm font-semibold text-white shadow-lg group-hover:flex">
                Tender Lists
              </span>
            ) : null}
          </NavLink>
          {/*<NavLink
            to="/pipeline"
            className={({ isActive }) =>
              `nav-item${isActive ? " active" : ""}`
            }
          >
            <i className="fa-solid fa-filter" aria-hidden="true" />
            <span className="sidebar-label">Pipeline</span>
          </NavLink>*/}
        </nav>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[var(--border)] bg-white px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 transition hover:bg-[var(--orange-400)] hover:text-white sm:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <i className="fa-solid fa-bars" aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-[1.15rem] font-bold text-slate-800">
                BUSINESS DEVELOPMENT DEPARTMENT
              </h1>
              <p className="text-sm text-slate-500">Tender Monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              className="cursor-pointer rounded-lg border border-transparent bg-transparent px-2 py-1 text-[1.05rem] font-bold text-slate-800 outline-none transition hover:border-orange-400"
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
            <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-200 text-slate-500">
              <i className="fa-regular fa-user" />
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto bg-[var(--bg)] px-8 py-5">
          <div className="grid gap-6">{children}</div>
        </section>
      </main>
    </div>
  );
};

export default Shell;
