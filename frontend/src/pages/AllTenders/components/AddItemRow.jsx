const AddItemRow = ({ onAdd }) => (
  <tr className="border-b border-slate-200 bg-white">
    <td
      className="sticky left-0 z-30 w-[332px] min-w-[332px] max-w-[332px] bg-white px-3 py-3"
      colSpan={2}
    >
      <button
        type="button"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-slate-600"
        onClick={onAdd}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
          +
        </span>
        <span>Add New PIN</span>
      </button>
    </td>
    <td className="w-[150px] min-w-[150px] max-w-[150px]" />
    <td className="w-[120px] min-w-[120px] max-w-[120px]" />
    <td className="w-[150px] min-w-[150px] max-w-[150px]" />
    <td className="w-[150px] min-w-[150px] max-w-[150px]" />
    <td className="w-[150px] min-w-[150px] max-w-[150px]" />
    <td className="w-[150px] min-w-[150px] max-w-[150px]" />
    <td className="w-[200px] min-w-[200px] max-w-[200px]" />
    <td className="w-[170px] min-w-[170px] max-w-[170px]" />
  </tr>
);

export default AddItemRow;
