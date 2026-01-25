const AddItemRow = ({ onAdd }) => (
  <tr className="add-item-row">
    <td className="w-pin sticky add-item-cell" colSpan={2}>
      <button type="button" className="add-item main-add-item" onClick={onAdd}>
        <span className="add-circle">+</span>
        <span>Add New PIN</span>
      </button>
    </td>
    <td className="w-client" />
    <td className="w-cons" />
    <td className="w-loc" />
    <td className="nowrap" />
    <td className="w-stage" />
    <td className="w-status" />
    <td className="w-timeline" />
    <td className="w-remarks" />
  </tr>
);

export default AddItemRow;
