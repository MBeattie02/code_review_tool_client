import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "./GraphPage.css";
import { Link } from "react-router-dom";

/**
 * Represents a page component for displaying trend analysis graphs.
 * @returns {JSX.Element} The rendered GraphPage component.
 */
const GraphPage = () => {
  // State hooks for managing chart data, input field value
  const [combinedChartDataSets, setCombinedChartDataSets] = useState([]);
  const [individualChartDataSets, setIndividualChartDataSets] = useState([]);
  const [pathInput, setPathInput] = useState("");

  // Function to fetch chart data from an API endpoint
  const fetchChartData = async () => {
    try {
      // API call to fetch data based on path input
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/combined-results/all/path/${pathInput}`
      );
      const { combinedResults, ...individualResults } = response.data;

      // Processing and setting state for combined and individual chart data
      const processedCombinedData = processCombinedResults(combinedResults);
      setCombinedChartDataSets(processedCombinedData);

      const processedIndividualData =
        processIndividualResults(individualResults);
      setIndividualChartDataSets(processedIndividualData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to filter data by path
  const filterByPath = (data) => {
    return data.filter(
      (item) =>
        item.repositoryInfo && item.repositoryInfo.path.includes(pathInput)
    );
  };

  // Function to sort data by timestamp
  const sortByTime = (data) => {
    return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Function to process combined results from the API response
  const processCombinedResults = (combinedResults) => {
    const filteredResults = filterByPath(combinedResults);
    const sortedResults = sortByTime(filteredResults); // Sort by time
    return sortedResults.map((result) => {
      return {
        id: result.id,
        repositoryInfo: result.repositoryInfo,
        timestamp: result.timestamp || "No timestamp available",
        chartData: {
          labels: [
            "Vulnerabilities",
            "Smells",
            "Quality",
            "Complexity",
            "Style",
          ],
          datasets: [
            {
              label: "Counts",
              data: [
                result.securityResultDocument?.vulnerabilitiesCount || 0,
                result.codeSmellResultDocument?.smellsCount || 0,
                result.qualityResultDocument?.qualityCount || 0,
                result.complexityResultDocument?.cyclomaticComplexity || 0,
                result.styleResultDocument?.violationCount || 0,
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 0.6)",
                "rgba(54, 162, 235, 0.6)",
                "rgba(255, 206, 86, 0.6)",
                "rgba(75, 192, 192, 0.6)",
                "rgba(153, 102, 255, 0.6)",
              ],
            },
          ],
        },
      };
    });
  };

  // Predefined color mapping for different analysis types
  const analysisTypeColors = {
    SecurityResults: "rgba(255, 99, 132, 0.6)",
    ComplexityResults: "rgba(54, 162, 235, 0.6)",
    QualityResults: "rgba(255, 206, 86, 0.6)",
    StyleResults: "rgba(75, 192, 192, 0.6)",
    CodeSmellResults: "rgba(153, 102, 255, 0.6)",
  };

  // Function to process individual results from the API response
  const processIndividualResults = (individualResults) => {
    let allResults = [];
    Object.entries(individualResults).forEach(([type, results]) => {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      const resultsWithType = results.map((result) => ({
        ...result,
        analysisType: capitalizedType,
      }));
      allResults.push(...resultsWithType);
    });

    const filteredResults = filterByPath(allResults);
    const sortedResults = sortByTime(filteredResults);
    return sortedResults.map((result) => {
      const color =
        analysisTypeColors[result.analysisType] || "rgba(153, 102, 255, 0.6)";
      return {
        id: result.id,
        repositoryInfo: result.repositoryInfo,
        timestamp: result.timestamp || "No timestamp available",
        analysisType: result.analysisType || "Unknown",
        chartData: {
          labels: ["Count"],
          datasets: [
            {
              label: "Count",
              data: [
                result.vulnerabilitiesCount ||
                  result.cyclomaticComplexity ||
                  result.smellsCount ||
                  result.qualityCount ||
                  result.violationCount,
              ],
              backgroundColor: [color],
            },
          ],
        },
      };
    });
  };

  // Effect hook to fetch chart data when pathInput changes
  useEffect(() => {
    // Only fetch data if pathInput is not empty
    if (pathInput.trim() !== "") {
      fetchChartData();
    }
  }, [pathInput]);

  // Handler for input field change
  const handleInputChange = (event) => {
    setPathInput(event.target.value);
  };

  // Function to render a bar chart using the 'Bar' component from chartjs
  const renderBarChart = (dataset) => {
    return (
      <Bar
        data={dataset.chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                // Additional configuration for ticks can go here
              },
            },
          },
        }}
      />
    );
  };

  // JSX for rendering the component
  return (
    <div className="graph-container">
      <div className="header-and-form-section">
        <h1>Bar Graph Trend Analysis Visualization</h1>
        <Link to="/" className="link-to-homepage">
          Return to Homepage
        </Link>
        <div className="query-form-2">
          <p>
            Enter name of previously analysed java class and view analysis
            trends
          </p>
          <input
            type="text"
            value={pathInput}
            onChange={handleInputChange}
            placeholder="Enter Path to filter"
            className="input-field-2"
          />
        </div>
      </div>

      {pathInput && (
        <>
          <div className="graphs-section">
            <h2>Combined Analysis Charts</h2>
            {combinedChartDataSets.map((dataset, index) => (
              <div key={index} className="graph-box">
                {renderBarChart(dataset)}
                <h2 className="graph-title">
                  Analysis ID: {dataset.id} <br />
                  Analysis Type: "Combined" <br />{" "}
                  {/* Assuming type is combined */}
                  Username: {dataset.repositoryInfo.username} <br />
                  Repository: {dataset.repositoryInfo.repo} <br />
                  Commit ID: {dataset.repositoryInfo.commitId} <br />
                  Path: {dataset.repositoryInfo.path} <br />
                  Timestamp: {dataset.timestamp || "No timestamp available"}
                </h2>
              </div>
            ))}
          </div>

          <div className="graphs-section">
            <h2>Individual Analysis Charts</h2>
            {individualChartDataSets.map((dataset, index) => (
              <div key={index} className="graph-box">
                {renderBarChart(dataset)}
                <h2 className="graph-title">
                  Analysis ID: {dataset.id} <br />
                  Analysis Type: {dataset.analysisType} <br />{" "}
                  {/* Assuming type is individual */}
                  Username: {dataset.repositoryInfo.username} <br />
                  Repository: {dataset.repositoryInfo.repo} <br />
                  Commit ID: {dataset.repositoryInfo.commitId} <br />
                  Path: {dataset.repositoryInfo.path} <br />
                  Timestamp: {dataset.timestamp || "No timestamp available"}
                </h2>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GraphPage;
