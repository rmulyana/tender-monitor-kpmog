import { Fragment } from "react";

import { TENDERS_TABLE_HEADERS } from "./tendersTableConfig.js";

const TableHeaderRow = ({ renderSortableHeader }) => (
  <tr className="bg-slate-50">
    {TENDERS_TABLE_HEADERS.map((header) =>
      header.sortable ? (
        <Fragment key={header.key ?? header.label}>
          {renderSortableHeader(header.label, header.key, header.className)}
        </Fragment>
      ) : (
        <th
          key={header.key ?? header.label}
          className={`border-b border-slate-200 px-3 py-3 text-left text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400 ${header.className}`}
        >
          {header.label}
        </th>
      ),
    )}
  </tr>
);

export default TableHeaderRow;
