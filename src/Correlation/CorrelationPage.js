import React, { useState, useEffect } from "react";
import "./CorrelationPage.css";
import { useNavigate } from "react-router-dom";
import Accordion from "./Accordion.js";
import HeatMap from "react-heatmap-grid";

// processData function to combine data based on path and line number
export const processData = (data) => {
  const combinedResults = {};

  const addIssue = (path, type, line, detail) => {
    if (!combinedResults[path]) {
      combinedResults[path] = {
        security: {},
        codeSmell: {},
        quality: {},
        style: {},
      };
    }

    if (!combinedResults[path][type][line]) {
      combinedResults[path][type][line] = new Set();
    }

    combinedResults[path][type][line].add(JSON.stringify({ type, detail }));
  };

  // Function to extract and add issues from both direct and nested formats
  const extractAndAddIssues = (result, type) => {
    const path = result.repositoryInfo?.path;
    if (!path) return;

    let issues = [];

    // Check if direct format
    if (
      result.vulnerabilities ||
      result.smells ||
      result.duplications ||
      result.violations
    ) {
      issues =
        result.vulnerabilities ||
        result.smells ||
        result.duplications ||
        result.violations;
    }
    // Check if nested within 'ResultDocument'
    else if (result[`${type}ResultDocument`]) {
      const document = result[`${type}ResultDocument`];
      issues =
        document.vulnerabilities ||
        document.smells ||
        document.duplications ||
        document.violations ||
        [];
    }

    issues.forEach((issue) => {
      const match = issue.match(/line (\d+):? (.*)/);
      const line = match ? match[1] : "unknown";
      const detail = match ? match[2] : issue;
      addIssue(path, type, line, detail);
    });
  };

  // Process combinedResults for each type
  if (data.combinedResults) {
    data.combinedResults.forEach((result) => {
      ["security", "codeSmell", "quality", "style"].forEach((type) => {
        extractAndAddIssues(result, type);
      });
    });
  }

  // Process direct result types
  ["security", "codeSmell", "quality", "style"].forEach((type) => {
    if (data[`${type}Results`]) {
      data[`${type}Results`].forEach((result) => {
        extractAndAddIssues(result, type);
      });
    }
  });

  return combinedResults;
};

const aggregateIssues = (data) => {
  const aggregatedData = {};

  Object.keys(data).forEach((path) => {
    aggregatedData[path] = {};

    const types = ["security", "codeSmell", "quality", "style"];
    types.forEach((type) => {
      Object.keys(data[path][type]).forEach((line) => {
        if (!aggregatedData[path][line]) {
          aggregatedData[path][line] = new Set();
        }
        data[path][type][line].forEach((issue) =>
          aggregatedData[path][line].add(issue)
        );
      });
    });

    // Filter out lines that have issues from only one analysis type
    Object.keys(aggregatedData[path]).forEach((line) => {
      const uniqueTypes = new Set();
      types.forEach((type) => {
        if (data[path][type][line]) {
          uniqueTypes.add(type);
        }
      });

      if (uniqueTypes.size <= 1) {
        delete aggregatedData[path][line];
      }
    });
  });

  return aggregatedData;
};

// AnalysisResults component to display the processed data
const AnalysisResults = ({ data }) => {
  const aggregatedIssues = aggregateIssues(data);

  // Initialize colors for alternating rows
  const colors = ["#f0f0f0", "#d9e2f3"];
  let currentColorIndex = 0;

  const filteredFiles = Object.keys(aggregatedIssues).filter(
    (path) => Object.keys(aggregatedIssues[path]).length > 0
  );

  return (
    <div className="page-container">
      {filteredFiles.map((path) => (
        <Accordion key={path} title={`File: ${path}`}>
          <table>
            <thead>
              <tr>
                <th>Line Number</th>
                <th>Type</th>
                <th>Issues</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(aggregatedIssues[path]).reduce(
                (acc, [line, issues], lineIndex) => {
                  // Use the line number to toggle color if it changes
                  if (
                    lineIndex > 0 &&
                    line !== Object.keys(aggregatedIssues[path])[lineIndex - 1]
                  ) {
                    currentColorIndex = 1 - currentColorIndex;
                  }

                  const issueRows = Array.from(issues).map(
                    (issueString, index) => {
                      const issue = JSON.parse(issueString);
                      return (
                        <tr
                          key={`${line}-${index}`}
                          style={{
                            backgroundColor: colors[currentColorIndex],
                          }}
                        >
                          <td>Line {line}</td>
                          <td>
                            {issue.type.charAt(0).toUpperCase() +
                              issue.type.slice(1)}
                          </td>
                          <td>{issue.detail}</td>
                        </tr>
                      );
                    }
                  );

                  acc.push(...issueRows);

                  if (
                    lineIndex <
                    Object.keys(aggregatedIssues[path]).length - 1
                  ) {
                    acc.push(
                      <tr
                        key={`${line}-spacer`}
                        style={{ height: "1em", backgroundColor: "#ffffff" }}
                      >
                        <td colSpan="3"></td>
                      </tr>
                    );
                  }

                  return acc;
                },
                []
              )}
            </tbody>
          </table>
        </Accordion>
      ))}
    </div>
  );
};

const CorrelationPage = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const [coOccurrenceData, setCoOccurrenceData] = useState({});

  // Function to navigate to the homepage
  const goToHomePage = () => {
    navigate("/"); // Navigate to the homepage
  };

  const calculateCoOccurrences = (aggregatedData) => {
    const analysisTypes = ["security", "codeSmell", "quality", "style"];
    let coOccurrenceMatrix = analysisTypes.reduce((acc, type) => {
      acc[type] = analysisTypes.reduce((innerAcc, innerType) => {
        innerAcc[innerType] = 0;
        return innerAcc;
      }, {});
      return acc;
    }, {});

    // Iterate through aggregatedData to count co-occurrences
    Object.values(aggregatedData).forEach((file) => {
      Object.values(file).forEach((line) => {
        let typesOnLine = Array.from(line).map(
          (issue) => JSON.parse(issue).type
        );
        typesOnLine.forEach((type, _, arr) => {
          arr.forEach((innerType) => {
            if (type !== innerType) {
              coOccurrenceMatrix[type][innerType] += 1;
            }
          });
        });
      });
    });

    return coOccurrenceMatrix;
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_URL}/api/combined-results/all`)
      .then((response) => response.json())
      .then((jsonData) => {
        const combinedData = processData(jsonData);
        const aggregatedData = aggregateIssues(combinedData);
        const coOccurrenceData = calculateCoOccurrences(aggregatedData);
        setData(combinedData);
        setCoOccurrenceData(coOccurrenceData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const xLabels = Object.keys(coOccurrenceData);
  const yLabels = Object.keys(coOccurrenceData);
  const heatmapData = xLabels.map((x, i) =>
    yLabels.map((y, j) => {
      if (j > i) {
        const value = coOccurrenceData[x]?.[y] || coOccurrenceData[y]?.[x] || 0;
        return value > 0 ? value : "";
      }
      return "";
    })
  );

  function calculateCellStyle(value, min, max) {
    if (
      typeof value === "number" &&
      typeof min === "number" &&
      typeof max === "number" &&
      max > min
    ) {
      const red = 255 * (1 - (value - min) / (max - min));
      const green = 255 * ((value - min) / (max - min));
      return `rgb(${Math.round(red)}, ${Math.round(green)}, 0)`;
    } else {
      return "rgb(220, 220, 220)";
    }
  }

  return (
    <div className="page-container">
      <div className="content-container">
        <button onClick={goToHomePage} className="button home-button">
          Return to Homepage
        </button>
        <h1>Code Analysis Summary</h1>
        <p className="description">
          This section allows for analysis of the correlation between different
          analysis types.
        </p>
        <h2>Heatmap Statistics</h2>
        <div className="heatmap-grid">
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            data={heatmapData}
            square={true}
            yLabelWidth={100}
            cellStyle={(background, value, min, max, data, x, y) => ({
              background: calculateCellStyle(value, min, max),
              fontSize: `${window.innerWidth < 768 ? 15 : 25}px`,
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid white",
            })}
            cellRender={(value) => `${value}`}
          />
        </div>
        {data ? <AnalysisResults data={data} /> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default CorrelationPage;
