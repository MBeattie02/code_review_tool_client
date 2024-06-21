import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StatPage.css";
import HeatMap from "react-heatmap-grid";
import useHeatmapData from "./useHeatmapData";
import SecurityIssueDescriptions from "../Statistics/Descriptions/SecurityIssueDescriptions";
import QualityIssueDescription from "../Statistics/Descriptions/QualityIssueDescription";
import SmellIssueDescription from "../Statistics/Descriptions/SmellIssueDescription";
import StyleIssueDescription from "../Statistics/Descriptions/StyleIssueDescription";

const violationDescriptionMapping = {
  "Potential hardcoded": "Potential hardcoded Secrets.",
  "High entropy": "High entropy Strings.",
  "Potential XSS": "Possibility of Cross-Site Scripting (XSS).",
  "Potential insecure": "Potentially insecure cryptographic algorithms.",
  "Potential SQL": "Risk of SQL injection.",
  "Potential race": "Race condition vulnerability.",
  "Weak cryptographic": "Obsolete or insecure cryptographic algorithms.",
};

const qualityDescriptionMapping = {
  "Access modifier": "Use more restrictive access modifiers.",
  "Duplicate code": "Duplicate code.",
  "Consider refactoring": "Refactoring loops to use lambdas and streams.",
};

const smellsDescriptionMapping = {
  "Javadoc Class": "Missing Javadoc documentation for classes.",
  "Javadoc Method": "Missing Javadoc documentation for Methods.",
  "Method Parameters": "Methods with too many parameters.",
  "Generic catch": "Catch Block which is too general.",
  "Swallowed exception": "Swallowing exceptions.",
};

const styleDescriptionMapping = {
  "Incorrect indentation": "Incorrect indentation.",
  "Opening brace": "Opening braces on the same line as the declaration.",
  "Import Organisation":
    "Organize imports alphabetically for readability and consistency.",
  "Local variable": "Local variables should be named using camelCase.",
  "Magic number": "Replace magic numbers with named constants.",
  "Method name":
    "Method names should start with a lowercase letter and follow camelCase..",
  "Class or":
    "Class and interface names should start with an uppercase letter.",
};

const CodeSmellsDisplay = ({ smellsCount, onRowClick }) => {
  if (!smellsCount || Object.keys(smellsCount).length === 0) {
    return <p>No violations found.</p>;
  }

  // Sort the violations by occurrence count (largest to smallest)
  const sortedViolations = Object.entries(smellsCount).sort(
    ([, countA], [, countB]) => countB - countA
  );

  return (
    <div>
      <h2>Smells Counts</h2>
      <table className="violations-table">
        <thead>
          <tr>
            <th>Violation Description</th>
            <th>Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {sortedViolations.map(([violation, count], index) => (
            <tr key={index} onClick={() => onRowClick(violation)}>
              <td>{smellsDescriptionMapping[violation] || violation}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StyleResultsDisplay = ({ styleCounts, onRowClick }) => {
  if (!styleCounts || Object.keys(styleCounts).length === 0) {
    return <p>No violations found.</p>;
  }

  // Sort the violations by occurrence count (largest to smallest)
  const sortedViolations = Object.entries(styleCounts).sort(
    ([, countA], [, countB]) => countB - countA
  );

  return (
    <div>
      <h2>Style Counts</h2>
      <table className="violations-table">
        <thead>
          <tr>
            <th>Violation Description</th>
            <th>Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {sortedViolations.map(([violation, count], index) => (
            <tr key={index} onClick={() => onRowClick(violation)}>
              <td>{styleDescriptionMapping[violation] || violation}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const QualityResultsDisplay = ({ qualityCounts, onRowClick }) => {
  if (!qualityCounts || Object.keys(qualityCounts).length === 0) {
    return <p>No violations found.</p>;
  }

  // Sort the violations by occurrence count (largest to smallest)
  const sortedViolations = Object.entries(qualityCounts).sort(
    ([, countA], [, countB]) => countB - countA
  );

  return (
    <div>
      <h2>Quality Counts</h2>
      <table className="violations-table">
        <thead>
          <tr>
            <th>Violation Description</th>
            <th>Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {sortedViolations.map(([violation, count], index) => (
            <tr key={index} onClick={() => onRowClick(violation)}>
              <td>{qualityDescriptionMapping[violation] || violation}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ViolationCountsDisplay = ({ violationCounts, onRowClick }) => {
  if (!violationCounts || Object.keys(violationCounts).length === 0) {
    return <p>No violations found.</p>;
  }

  // Sort the violations by occurrence count (largest to smallest)
  const sortedViolations = Object.entries(violationCounts).sort(
    ([, countA], [, countB]) => countB - countA
  );

  return (
    <div>
      <h2>Security Counts</h2>
      <table className="violations-table">
        <thead>
          <tr>
            <th>Violation Description</th>
            <th>Occurrences</th>
          </tr>
        </thead>
        <tbody>
          {sortedViolations.map(([violation, count], index) => (
            <tr key={index} onClick={() => onRowClick(violation)}>
              <td>{violationDescriptionMapping[violation] || violation}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StatPage = () => {
  const [violationCounts, setViolationCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isHeatmapLoading, setIsHeatmapLoading] = useState(true);
  const [error, setError] = useState(null);
  const [smellsCount, setSmellsCount] = useState([]);
  const [qualityCounts, setQualityCounts] = useState([]);
  const [styleCounts, setStyleCounts] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const apiUrl = `${process.env.REACT_APP_URL}/api/combined-results/all`;
  const { heatmapData, xLabels, yLabels } = useHeatmapData(apiUrl);
  const navigate = useNavigate();

  // Function to navigate to the homepage
  const goToHomePage = () => {
    navigate("/"); // Navigate to the homepage
  };

  const handleRowClick = (title) => {
    const issueDetails = SecurityIssueDescriptions[title] || {
      description: "Description not available.",
      solution: "Solution not available.",
      codeExample: "Code example not available.",
    };
    setSelectedItem({
      title,
      description: issueDetails.description,
      solution: issueDetails.solution,
      codeExample: issueDetails.codeExample,
    });
  };

  const handleRowClickStyle = (title) => {
    const issueDetails = StyleIssueDescription[title] || {
      description: "Description not available.",
      solution: "Solution not available.",
      codeExample: "Code example not available.",
    };
    setSelectedItem({
      title,
      description: issueDetails.description,
      solution: issueDetails.solution,
      codeExample: issueDetails.codeExample,
    });
  };

  const handleRowClickQuality = (title) => {
    const issueDetails = QualityIssueDescription[title] || {
      description: "Description not available.",
      solution: "Solution not available.",
      codeExample: "Code example not available.",
    };
    setSelectedItem({
      title,
      description: issueDetails.description,
      solution: issueDetails.solution,
      codeExample: issueDetails.codeExample,
    });
  };

  const handleRowClickSmells = (title) => {
    const issueDetails = SmellIssueDescription[title] || {
      description: "Description not available.",
      solution: "Solution not available.",
      codeExample: "Code example not available.",
    };
    setSelectedItem({
      title,
      description: issueDetails.description,
      solution: issueDetails.solution,
      codeExample: issueDetails.codeExample,
    });
  };

  const aggregateCounts = (securityResults) => {
    const counts = {};
    if (Array.isArray(securityResults)) {
      securityResults.forEach((result) => {
        const items = result.vulnerabilities || [];

        if (Array.isArray(items)) {
          items.forEach((item) => {
            // Split the string at the colon and take the part after it
            const afterColon = item.split(":")[1] || "";
            // Get the first two words after the colon
            const key = afterColon.trim().split(" ").slice(0, 2).join(" ");
            counts[key] = (counts[key] || 0) + 1;
          });
        }
      });
    }
    return counts;
  };

  const aggregateStyleCounts = (styleResults) => {
    const counts = {};
    if (Array.isArray(styleResults)) {
      styleResults.forEach((result) => {
        const items = result.violations || [];

        if (Array.isArray(items)) {
          items.forEach((item) => {
            // Split the string at the colon and take the part after it
            const afterColon = item.split(":")[1] || "";
            // Get the first two words after the colon
            const key = afterColon.trim().split(" ").slice(0, 2).join(" ");
            counts[key] = (counts[key] || 0) + 1;
          });
        }
      });
    }
    return counts;
  };

  const aggregateQualityCounts = (qualityResults) => {
    const counts = {};
    if (Array.isArray(qualityResults)) {
      qualityResults.forEach((result) => {
        const items = result.duplications || [];

        if (Array.isArray(items)) {
          items.forEach((item) => {
            // Split the string at the colon and take the part after it
            const afterColon = item.split(":")[1] || "";
            // Get the first two words after the colon
            const key = afterColon.trim().split(" ").slice(0, 2).join(" ");
            counts[key] = (counts[key] || 0) + 1;
          });
        }
      });
    }
    return counts;
  };

  const aggregateSmellsCounts = (codeSmellResults) => {
    const counts = {};
    if (Array.isArray(codeSmellResults)) {
      codeSmellResults.forEach((result) => {
        const items = result.smells || [];

        if (Array.isArray(items)) {
          items.forEach((item) => {
            // Split the string at the colon and take the part after it
            const afterColon = item.split(":")[1] || "";
            // Get the first two words after the colon
            const key = afterColon.trim().split(" ").slice(0, 2).join(" ");
            counts[key] = (counts[key] || 0) + 1;
          });
        }
      });
    }
    return counts;
  };

  useEffect(() => {
    setIsLoading(true);
    setIsHeatmapLoading(true);

    fetch(`${process.env.REACT_APP_URL}/api/combined-results/all`)
      .then((response) => response.json())
      .then((data) => {
        const violationCounts = aggregateCounts(
          data.securityResults,
          "vulnerabilities"
        );
        setViolationCounts(violationCounts);

        const styleCounts = aggregateStyleCounts(
          data.styleResults,
          "violations"
        );
        setStyleCounts(styleCounts);

        const qualityCounts = aggregateQualityCounts(
          data.qualityResults,
          "duplications"
        );
        setQualityCounts(qualityCounts);

        const smellsCount = aggregateSmellsCounts(
          data.codeSmellResults,
          "smells"
        );
        setSmellsCount(smellsCount);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
        setIsHeatmapLoading(false);
      });
  }, []);

  let content;

  if (isLoading) {
    content = <p>Loading violations data...</p>;
  } else if (error) {
    content = <p>Error loading data: {error}</p>;
  } else {
    content = (
      <ViolationCountsDisplay
        violationCounts={violationCounts}
        onRowClick={handleRowClick}
      />
    );
  }

  const Modal = ({ item, onClose }) => {
    return (
      <div className="modal">
        <button onClick={onClose}>Close</button>
        <div>
          <h3>{item.title}</h3>
          <p>
            <strong>Description:</strong> {item.description}
          </p>
          <p>
            <strong>Solution:</strong> {item.solution}
          </p>
          <div>
            <strong>Code Example:</strong>
            <pre>
              <code>{item.codeExample}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  };

  function calculateCellStyle(value, min, max) {
    if (
      typeof value === "number" &&
      typeof min === "number" &&
      typeof max === "number" &&
      max > min
    ) {
      const red = 255 * (1 - (value - min) / (max - min));
      const green = 255 * ((value - min) / (max - min));
      return `rgb(${Math.round(green)}, ${Math.round(red)}, 0)`;
    } else {
      return "rgb(220, 220, 220)";
    }
  }

  return (
    <div className="page-content">
      <div className="stat-page">
        <div className="centered-container">
          <button onClick={goToHomePage} className="button home-button">
            Return to Homepage
          </button>
          <h1 className="title">Violations Issue Statistics</h1>
          <p className="description">
            This section gives statistics on the most common issues detected
            among all code bases checked.
          </p>
        </div>

        <h2>Heatmap Statistics</h2>
        <div className="heatmap-grid">
          {isHeatmapLoading ? (
            <p>Loading heatmap data...</p> // Display a loading message for the heatmap specifically
          ) : (
            <HeatMap
              xLabels={xLabels}
              yLabels={yLabels}
              yLabelWidth={300}
              data={heatmapData}
              cellStyle={(background, value, min, max, data, x, y) => ({
                background: calculateCellStyle(value, min, max),
                fontSize: `${window.innerWidth < 768 ? 10 : 14}px`,
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid white",
              })}
              cellRender={(value) => value && `${value}`}
            />
          )}
        </div>

        {isLoading ? (
          <p>Loading violations data...</p> // Loading message for the main content
        ) : error ? (
          <p>Error loading data: {error}</p> // Error message for the main content
        ) : (
          <>
            <ViolationCountsDisplay
              violationCounts={violationCounts}
              onRowClick={handleRowClick}
            />
            <CodeSmellsDisplay
              smellsCount={smellsCount}
              onRowClick={handleRowClickSmells}
            />
            <QualityResultsDisplay
              qualityCounts={qualityCounts}
              onRowClick={handleRowClickQuality}
            />
            <StyleResultsDisplay
              styleCounts={styleCounts}
              onRowClick={handleRowClickStyle}
            />
          </>
        )}

        {selectedItem && (
          <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </div>
    </div>
  );
};

export default StatPage;
