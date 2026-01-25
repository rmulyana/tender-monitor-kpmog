import "../../styles/tenders.css";

const stageClasses = {
  Registration: "stage-registration",
  "Pre-Qualification": "stage-prequal",
  Proposal: "stage-proposal",
  Negotiation: "stage-negotiation",
  Contract: "stage-contract",
};

const StagePill = ({ stage }) => (
  <span className={`stage-pill ${stageClasses[stage] || ""}`.trim()}>
    {stage}
  </span>
);

export default StagePill;
