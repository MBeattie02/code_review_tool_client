import React, { useState } from "react";
import "../DisplayResults.css";
import ComplexityDescription from "../Descriptions/ComplexityDescription.js";
import IssueDetailModal from "../IssueModal/VulnerabilityModal";

/**
 * Renders the complexity results component.
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data object containing complexity results.
 * @returns {JSX.Element} The complexity results component.
 */
function ComplexityResults({ data }) {
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);

  if (!data || Object.keys(data).length === 0) {
    return <p>No data to display</p>;
  }

  const { cyclomaticComplexity, repositoryInfo, id, timestamp, customId } =
    data;

  const handleComplexityClick = (complexityNumber) => {
    // Find all matching ranges
    const matchingRanges = ComplexityDescription.filter(
      (range) =>
        complexityNumber >= (range.min || 0) &&
        complexityNumber <= (range.max || Number.MAX_SAFE_INTEGER)
    );

    // Update state with an array of descriptions
    const details =
      matchingRanges.length > 0
        ? matchingRanges.map((range) => range.description)
        : ["Detail not available."];

    setSelectedVulnerability(details);
  };

  return (
    <div className="complexity-results-container">
      {/* Display ID */}
      {id && (
        <div className="repo-info">
          <h2>ID</h2>
          <p>{id}</p>
          <h2>Readable ID</h2>
          <p>{customId}</p>
        </div>
      )}

      {/* Display Timestamp */}
      {timestamp && (
        <div className="result-card">
          <h2>Timestamp</h2>
          <p>{timestamp}</p>
        </div>
      )}

      {/* Display Cyclomatic Complexity */}
      {cyclomaticComplexity && (
        <div className="result-card">
          <h3>Cyclomatic Complexity</h3>
          <ul>
            <li
              onClick={() => handleComplexityClick(cyclomaticComplexity)}
              className="vulnerability-item"
            >
              {cyclomaticComplexity}
            </li>
          </ul>
        </div>
      )}

      {/* Modal for displaying vulnerability details */}
      {selectedVulnerability && selectedVulnerability.length > 0 && (
        <IssueDetailModal
          detail={
            <ul>
              {selectedVulnerability.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          }
          onClose={() => setSelectedVulnerability(null)}
        />
      )}

      {/* Display repository information */}
      {repositoryInfo && (
        <div className="repo-info">
          <h2>Repository Information</h2>
          <p>Username: {repositoryInfo.username}</p>
          <p>Repository: {repositoryInfo.repo}</p>
          <p>Commit ID: {repositoryInfo.commitId}</p>
          <p>Path: {repositoryInfo.path}</p>
        </div>
      )}
    </div>
  );
}

export default ComplexityResults;
