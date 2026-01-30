const DetailRow = ({ className, children }) => (
  <tr
    className={[
      "group",
      "hover:bg-orange-200/20",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {children}
  </tr>
);

export default DetailRow;
