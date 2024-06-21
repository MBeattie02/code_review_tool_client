import React, { useState } from "react";
import "../DisplayResults.css";
import issueDescriptions from "../Descriptions/SmellIssueDescription.js";
import IssueDetailModal from "../IssueModal/VulnerabilityModal";

/**
 * Renders the analysis results for code smells.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data containing the analysis results.
 * @returns {JSX.Element} The rendered component.
 */
function SmellsResults({ data }) {
  const [selectedVulnerability, setSelectedVulnerability] = useState(null);
  // Check if 'data' is null or empty
  if (!data || Object.keys(data).length === 0) {
    return <p>No data to display</p>;
  }

  // Destructure data if needed
  const { smells, repositoryInfo, id, smellsCount, timestamp, customId } = data;

  // Function to extract line number from a smell string
  const extractLineNumber = (smell) => {
    const match = smell.match(/Violation at line (\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Sort smells by line number
  const sortedSmells = smells.sort((a, b) => {
    const lineA = extractLineNumber(a);
    const lineB = extractLineNumber(b);
    return lineA - lineB;
  });

  // Function to handle clicking on a vulnerability
  const handleVulnerabilityClick = (smell) => {
    const issueKeyPattern = /Violation at line \d+:\s+(\w+\s+\w+)/;
    const match = smell.match(issueKeyPattern);
    const issueKey = match ? match[1].trim() : null;
    console.log("Issue Key:", issueKey);

    const detail = issueDescriptions[issueKey];
    console.log("Detail:", detail);

    setSelectedVulnerability(detail || "Detail not available.");
  };

  return (
    <div className="complexity-results-container">
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
      {typeof smellsCount === "number" && (
        <div className="result-card">
          <h2>Statistics</h2>
          <p>Total Violations: {smellsCount}</p>
        </div>
      )}

      {/* Display Smells */}
      {smells && (
        <div className="result-card">
          <h3>smells</h3>
          <ul>
            {sortedSmells.map((smell, index) => (
              <li
                key={index}
                onClick={() => handleVulnerabilityClick(smell)}
                className="vulnerability-item"
              >
                {smell}
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

export default SmellsResults;
