import React, { useState } from "react";
import "../DisplayResults.css"; // Import the CSS file for styling
import IssueDetailModal from "../IssueModal/VulnerabilityModal";
import ComplexityDescription from "../Descriptions/ComplexityDescription.js";
import issueDescriptionsSecurity from "../Descriptions/SecurityIssueDescriptions.js";
import issueDescriptionsQuality from "../Descriptions/QualityIssueDescription.js";
import issueDescriptionsSmells from "../Descriptions/SmellIssueDescription.js";
import issueDescriptionsStyle from "../Descriptions/StyleIssueDescription.js";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

//For Mongo
/**
 * Renders the combined results component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - The combined data to be displayed.
 * @returns {JSX.Element} The rendered combined results component.
 */
function CombinedResults({ data }) {
  console.log("Combined Result: ", data);
  const [selectedDetail, setSelectedDetail] = useState(null);
  if (!data) return <p>No combined data to display</p>;

  // Destructuring relevant data from the passed data object
  const {
    qualityResultDocument,
    codeSmellResultDocument,
    securityResultDocument,
    complexityResultDocument,
    styleResultDocument,
  } = data;

  // Extract repositoryInfo from combinedResult
  const repositoryInfo = data.repositoryInfo;
  const id = data.id;
  const time = data.timestamp;
  const customId = data.customId;

  const handleVulnerabilityClick = (vulnerability) => {
    const issueKeyPattern = /Violation at line \d+:\s+(\w+\s+\w+)/;
    const match = vulnerability.match(issueKeyPattern);
    const issueKey = match ? match[1].trim() : null;
    console.log("Issue Key:", issueKey);

    const detail = issueDescriptionsSecurity[issueKey];
    console.log("Detail:", detail);

    setSelectedDetail(detail || "Detail not available.");
  };

  const handleStyleClick = (violation) => {
    const issueKeyPattern = /Violation at line \d+:\s+(\w+\s+\w+)/;
    const match = violation.match(issueKeyPattern);
    const issueKey = match ? match[1].trim() : null;
    console.log("Issue Key:", issueKey);

    const detail = issueDescriptionsStyle[issueKey];
    console.log("Detail:", detail);

    setSelectedDetail(detail || "Detail not available.");
  };

  // Function to handle clicking on a vulnerability
  const handleQualityClick = (duplication) => {
    const issueKeyPattern = /Violation(?: at line \d+)?:\s+(\w+\s+\w+)/;
    const match = duplication.match(issueKeyPattern);
    const issueKey = match ? match[1].trim() : null;
    console.log("Issue Key:", issueKey);

    const detail = issueDescriptionsQuality[issueKey];
    console.log("Detail:", detail);

    setSelectedDetail(detail || "Detail not available.");
  };

  const handleSmellsClick = (smell) => {
    const issueKeyPattern = /Violation at line \d+:\s+(\w+\s+\w+)/;
    const match = smell.match(issueKeyPattern);
    const issueKey = match ? match[1].trim() : null;
    console.log("Issue Key:", issueKey);

    const detail = issueDescriptionsSmells[issueKey];
    console.log("Detail:", detail);

    setSelectedDetail(detail || "Detail not available.");
  };

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

    setSelectedDetail(details || "Detail not available.");
  };

  // JSX for rendering the component layout
  return (
    <div className="results-container">
      <Id id={id} customId={customId} time={time} />
      <ResultChart data={data} />
      <RepositoryInfo info={repositoryInfo} />
      {qualityResultDocument && (
        <QualityResult
          result={qualityResultDocument}
          handleQualityClick={handleQualityClick}
        />
      )}
      {codeSmellResultDocument && (
        <CodeSmellResult
          result={codeSmellResultDocument}
          handleSmellsClick={handleSmellsClick}
        />
      )}
      {securityResultDocument && (
        <SecurityResult
          result={securityResultDocument}
          handleVulnerabilityClick={handleVulnerabilityClick}
        />
      )}
      {complexityResultDocument && (
        <ComplexityResult
          result={complexityResultDocument}
          handleComplexityClick={handleComplexityClick}
        />
      )}
      {styleResultDocument && (
        <StyleResult
          result={styleResultDocument}
          handleStyleClick={handleStyleClick}
        />
      )}
      {selectedDetail && (
        <IssueDetailModal
          detail={selectedDetail}
          onClose={() => setSelectedDetail(null)}
        />
      )}
    </div>
  );
}

// Function to extract line number from a result string
const extractLineNumber = (resultString) => {
  const match = resultString.match(/Violation at line (\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

// Component to display analysis ID and timestamp
function Id(props) {
  return (
    <div className="repo-info">
      <h2>Analysis ID</h2>
      <p> ID: {props.id}</p>
      <h2>Readable ID</h2>
      <p>{props.customId}</p>
      <p>Timestamp: {props.time}</p>
    </div>
  );
}

// Component to display Quality Results
function QualityResult({ result, handleQualityClick }) {
  if (!result || !result.duplications || result.duplications.length === 0) {
    return (
      <div className="result-card">
        <h3>Quality Results</h3>
        <p>No Quality Issues</p>
      </div>
    );
  }
  const sortedDuplications = result.duplications.sort((a, b) => {
    return extractLineNumber(a) - extractLineNumber(b);
  });
  return (
    <div className="result-card">
      <h3>Quality Results</h3>
      <ul>
        {sortedDuplications.map((duplication, index) => (
          <li
            key={index}
            onClick={() => handleQualityClick(duplication)}
            className="vulnerability-item"
          >
            {duplication}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Component to display Code Smell Results
function CodeSmellResult({ result, handleSmellsClick }) {
  if (!result || !result.smells || result.smells.length === 0) {
    return (
      <div className="result-card">
        <h3>Code Smell Results</h3>
        <p>No Code Smells</p>
      </div>
    );
  }
  const sortedSmells = result.smells.sort((a, b) => {
    return extractLineNumber(a) - extractLineNumber(b);
  });
  return (
    <div className="result-card">
      <h3>Code Smell Results</h3>
      <ul>
        {sortedSmells.map((smell, index) => (
          <li
            key={index}
            onClick={() => handleSmellsClick(smell)}
            className="vulnerability-item"
          >
            {smell}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Component to display Security Results
function SecurityResult({ result, handleVulnerabilityClick }) {
  if (
    !result ||
    !result.vulnerabilities ||
    result.vulnerabilities.length === 0
  ) {
    return (
      <div className="result-card">
        <h3>Security Results</h3>
        <p>No Security Issues</p>
      </div>
    );
  }
  const sortedVulnerabilities = result.vulnerabilities.sort((a, b) => {
    return extractLineNumber(a) - extractLineNumber(b);
  });
  return (
    <div className="result-card">
      <h3>Security Results</h3>
      <ul>
        {sortedVulnerabilities.map((vulnerability, index) => (
          <li
            key={index}
            onClick={() => handleVulnerabilityClick(vulnerability)}
            className="vulnerability-item"
          >
            {vulnerability}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Component to display Complexity Results
function ComplexityResult({ result, handleComplexityClick }) {
  // Check if result is null or undefined, or if violations array is empty
  if (
    !result ||
    !result.cyclomaticComplexity ||
    result.cyclomaticComplexity.length === 0
  ) {
    return (
      <div className="result-card">
        <h3>cyclomaticComplexity</h3>
        <p>Complexity Not Calculated</p>
      </div>
    );
  }

  return (
    <div className="result-card">
      <h3>Complexity Results</h3>
      <ul>
        <li
          onClick={() => handleComplexityClick(result.cyclomaticComplexity)}
          className="vulnerability-item"
        >
          {result.cyclomaticComplexity}
        </li>
      </ul>
    </div>
  );
}

// Component to display Style Results
function StyleResult({ result, handleStyleClick }) {
  // Check if result is null or undefined, or if violations array is empty
  if (!result || !result.violations || result.violations.length === 0) {
    return (
      <div className="result-card">
        <h3>Violations</h3>
        <p>No style violations found</p>
      </div>
    );
  }

  const sortedViolations = result.violations.sort((a, b) => {
    return extractLineNumber(a) - extractLineNumber(b);
  });

  return (
    <div className="result-card">
      <h3>Violations</h3>
      <ul>
        {sortedViolations.map((violation, index) => (
          <li
            key={index}
            onClick={() => handleStyleClick(violation)}
            className="vulnerability-item"
          >
            {violation}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Component to display repository information
function RepositoryInfo({ info }) {
  if (!info) return null;
  return (
    <div className="repo-info">
      <h2>Repository Information</h2>
      <p>Username: {info.username}</p>
      <p>Repository: {info.repo}</p>
      <p>Commit ID: {info.commitId}</p>
      <p>Path: {info.path}</p>
    </div>
  );
}

// Function to aggregate counts from different result types for the chart
function aggregateCounts(data) {
  const qualityCount = data.qualityResultDocument?.qualityCount || 0;
  const smellsCount = data.codeSmellResultDocument?.smellsCount || 0;
  const vulnerabilitiesCount =
    data.securityResultDocument?.vulnerabilitiesCount || 0;
  const violationCount = data.styleResultDocument?.violationCount || 0;

  return [qualityCount, smellsCount, vulnerabilitiesCount, violationCount];
}

// Component to display a chart summarizing the results
function ResultChart({ data }) {
  const counts = aggregateCounts(data);
  const chartData = {
    labels: [
      "Quality Issues",
      "Code Smells",
      "Vulnerabilities",
      "Style Violations",
    ],
    datasets: [
      {
        label: "Counts",
        data: counts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="repo-info">
      <h2>Statistics</h2>
      <div className="chart-container">
        <h2 className="chart-title">Summary of Results</h2>
        <div className="bar-chart">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default CombinedResults;
