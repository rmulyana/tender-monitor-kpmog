import { useState } from "react";

const useTenderExpansionState = ({
  setExpandedStages,
  setStagePickerForTender,
  setStagePickerValue,
  closeAttachmentMenu,
}) => {
  const [expandedPin, setExpandedPin] = useState(null);

  const togglePin = (id) => {
    setExpandedPin((prev) => (prev === id ? null : id));
    setExpandedStages(new Set());
    setStagePickerForTender(null);
    setStagePickerValue("");
    closeAttachmentMenu();
  };

  return {
    expandedPin,
    setExpandedPin,
    togglePin,
  };
};

export default useTenderExpansionState;
