import React, { useState } from "react";
import "../DisplayResults.css"; // Import the CSS file for styling
import issueDescriptions from "../Descriptions/QualityIssueDescription.js";
import IssueDetailModal from "../IssueModal/VulnerabilityModal";

/**
 * Renders the quality results component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data object containing quality results.
 * @returns {JSX.Element} The rendered quality results component.
 */
function QualityResults({ data }) {
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  // Check if 'data' is null or empty
  if (!data || Object.keys(data).length === 0) {
    return <p>No data to display</p>;
  }

  // Destructure data if needed
  const {
    duplications,
    repositoryInfo,
    id,
    qualityCount,
    timestamp,
    customId,
  } = data;

  // Function to extract line number from a duplication string
  const extractLineNumber = (duplication) => {
    const match = duplication.match(/Violation at line (\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Sort duplications by line number
  const sortedDuplications = duplications.sort((a, b) => {
    const lineA = extractLineNumber(a);
    const lineB = extractLineNumber(b);
    return lineA - lineB;
  });

  // Function to handle clicking on a vulnerability
  const handleVulnerabilityClick = (duplication) => {
    const issueKeyPattern = /Violation(?: at line \d+)?:\s+(\w+\s+\w+)/;
    const match = duplication.match(issueKeyPattern);
    const issueKey = match ? match[1].trim() : null;
    console.log("Issue Key:", issueKey);

    const detail = issueDescriptions[issueKey];
    console.log("Detail:", detail);

    setSelectedVulnerability(detail || "Detail not available.");
  };

  return (
    <div className="custom-results-container">
      {/* Display id */}
      {id && (
        <div className="repo-info">
          <h2>ID</h2>
          <p>{id}</p>
          <h2>Readable ID</h2>
          <p>{customId}</p>
        </div>
      )}

      {/* Display Timestamp */}
      {timestamp && timestamp.length > 0 && (
        <div className="result-card">
          <h2>Timestamp</h2>
          <p>{timestamp}</p>
        </div>
      )}

      {/* Display stats */}
      {typeof qualityCount === "number" && (
        <div className="result-card">
          <h2>Statistics</h2>
          <p>Total Violations: {qualityCount}</p>
        </div>
      )}

      {/* Display duplications */}
      {sortedDuplications && sortedDuplications.length > 0 && (
        <div className="result-card">
          <h3>Duplications</h3>
          <ul>
            {sortedDuplications.map((duplication, index) => (
              <li
                key={index}
                onClick={() => handleVulnerabilityClick(duplication)}
                className="vulnerability-item"
              >
                {duplication}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal for displaying vulnerability details */}
      {selectedVulnerability && (
        <IssueDetailModal
          detail={selectedVulnerability}
          onClose={() => setSelectedVulnerability(null)}
        />
      )}

      {/* Display repositoryInfo */}
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

export default QualityResults;
