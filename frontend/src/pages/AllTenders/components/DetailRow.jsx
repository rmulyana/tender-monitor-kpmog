const DetailRow = ({ className, children }) => (
  <tr
    className={["group", className]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </tr>
);

export default DetailRow;
