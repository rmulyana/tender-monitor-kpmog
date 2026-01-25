import { Fragment } from "react";

import { TENDERS_TABLE_HEADERS } from "./tendersTableConfig.js";

const TableHeaderRow = ({ renderSortableHeader }) => (
  <tr>
    {TENDERS_TABLE_HEADERS.map((header) =>
      header.sortable ? (
        <Fragment key={header.key ?? header.label}>
          {renderSortableHeader(header.label, header.key, header.className)}
        </Fragment>
      ) : (
        <th key={header.key ?? header.label} className={header.className}>
          {header.label}
        </th>
      ),
    )}
  </tr>
);

export default TableHeaderRow;
