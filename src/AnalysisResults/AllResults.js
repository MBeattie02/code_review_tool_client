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

// Registering necessary components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Main functional component to display all analysis results.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.data - The data object containing analysis results.
 * @returns {JSX.Element} - The rendered component with analysis results.
 */
function AllResults({ data }) {
  const [selectedDetail, setSelectedDetail] = useState(null);
  if (!data) return <p>No data to display</p>;

  const {
    qualityResult,
    codeSmellResult,
    securityResult,
    complexityResult,
    styleResult,
    repositoryInfo,
    id,
    customId,
  } = data;
  const counts = aggregateCounts(data);

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

  // JSX for rendering the component layout with all result components
  return (
    <div className="results-container">
      <Id info={id} customId={customId} />
      <CountsDisplay counts={counts} />
      <RepositoryInfo info={repositoryInfo} />
      <QualityResult
        result={qualityResult}
        handleQualityClick={handleQualityClick}
      />
      <CodeSmellResult
        result={codeSmellResult}
        handleSmellsClick={handleSmellsClick}
      />
      <SecurityResult
        result={securityResult}
        handleVulnerabilityClick={handleVulnerabilityClick}
      />
      <ComplexityResult
        result={complexityResult}
        handleComplexityClick={handleComplexityClick}
      />
      <StyleResult result={styleResult} handleStyleClick={handleStyleClick} />

      {selectedDetail && (
        <IssueDetailModal
          detail={selectedDetail}
          onClose={() => setSelectedDetail(null)}
        />
      )}
    </div>
  );
}

// Function to extract line number from a result string (used in sorting results)
const extractLineNumber = (resultString) => {
  const match = resultString.match(/Violation at line (\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

// Component to display the analysis ID
function Id({ info, customId }) {
  if (!info) return null;
  return (
    <div className="repo-info">
      <h2>Analysis ID</h2>
      <p>{info}</p>
      <h2>Readable ID</h2>
      <p>{customId}</p>
    </div>
  );
}

// Function to aggregate counts for different result types
function aggregateCounts(data) {
  if (!data) return null;

  const qualityCount = data.qualityResult?.qualityCount || 0;
  const smellsCount = data.codeSmellResult?.smellsCount || 0;
  const vulnerabilitiesCount = data.securityResult?.vulnerabilitiesCount || 0;
  const violationCount = data.styleResult?.violationCount || 0;

  return {
    qualityCount,
    smellsCount,
    vulnerabilitiesCount,
    violationCount,
  };
}

// Component to display a chart with aggregated counts
function CountsDisplay({ counts }) {
  if (!counts) return null;

  const data = {
    labels: [
      "Quality Issues",
      "Code Smells",
      "Vulnerabilities",
      "Style Violations",
    ],
    datasets: [
      {
        label: "Count",
        data: [
          counts.qualityCount,
          counts.smellsCount,
          counts.vulnerabilitiesCount,
          counts.violationCount,
        ],
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

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="repo-info">
      <h2>Statistics</h2>
      <div className="chart-container">
        <h2 className="chart-title">Summary of Results</h2>
        <div className="bar-chart">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

// Individual component for displaying Quality analysis result
function QualityResult({ result, handleQualityClick }) {
  if (!result || !result.duplications || result.duplications.length === 0) {
    return (
      <div className="result-card">
        <h3>Quality Results</h3>
        <p>No Quality Issues</p>
      </div>
    );
  }

  // Sort duplications by line number
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

// Individual component for displaying code smell analysis result
function CodeSmellResult({ result, handleSmellsClick }) {
  if (!result || !result.smells || result.smells.length === 0) {
    return (
      <div className="result-card">
        <h3>Code Smell Results</h3>
        <p>No Code Smells</p>
      </div>
    );
  }

  // Sort smells by line number
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

// Individual component for displaying security analysis result
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

  // Sort vulnerabilities by line number
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

// Individual component for displaying complexity analysis result
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
      <h3>Cyclomatic Complexity</h3>
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

// Individual component for displaying style analysis result
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

  // Sort violations by line number
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

export default AllResults;
