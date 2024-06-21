import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import "./TrendPage.css";
import { Link } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrendPage = () => {
  const [chartData, setChartData] = useState({});
  const [pathInput, setPathInput] = useState("");
  const [fullData, setFullData] = useState({});
  const [repoInfo, setRepoInfo] = useState(null);

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/combined-results/all`
      );
      setFullData(response.data);
      const processedData = processDataForGraph(response.data);
      setChartData(processedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  const processDataForGraph = (response) => {
    const categories = {
      securityResults: "security",
      complexityResults: "complexity",
      codeSmellResults: "smells",
      qualityResults: "quality",
      styleResults: "style",
    };

    // Initialize data structure
    const dataByPath = {};

    // Process individual categories
    Object.keys(categories).forEach((categoryKey) => {
      response[categoryKey].forEach((item) => {
        const path = item.repositoryInfo.path;
        const categoryName = categories[categoryKey];

        if (!dataByPath[path]) {
          dataByPath[path] = {
            security: [],
            style: [],
            smells: [],
            complexity: [],
            quality: [],
          };
        }

        let count;
        if (categoryName === "style") {
          count = item.violationCount;
        } else if (categoryName === "security") {
          count = item.vulnerabilitiesCount;
        } else if (categoryName === "complexity") {
          count = item.cyclomaticComplexity;
        } else {
          count = item[`${categoryName}Count`] || 0;
        }

        dataByPath[path][categoryName].push({
          x: new Date(item.timestamp),
          y: count,
        });
      });

      // Sort each category array by timestamp
      Object.keys(dataByPath).forEach((path) => {
        if (dataByPath[path][categories[categoryKey]]) {
          dataByPath[path][categories[categoryKey]].sort((a, b) => a.x - b.x);
        }
      });
    });

    // Process combinedResults
    response.combinedResults.forEach((combinedItem) => {
      const path = combinedItem.repositoryInfo.path;
      const combinedTimestamp = new Date(combinedItem.timestamp);

      if (!dataByPath[path]) {
        dataByPath[path] = {
          security: [],
          style: [],
          smells: [],
          complexity: [],
          quality: [],
        };
      }

      // Process codeSmellResultDocument
      if (combinedItem.codeSmellResultDocument) {
        const smellDoc = combinedItem.codeSmellResultDocument;
        const timestamp = smellDoc.timestamp
          ? new Date(smellDoc.timestamp)
          : combinedTimestamp;
        const count = smellDoc.smellsCount || 0;

        if (!dataByPath[path]["smells"]) {
          dataByPath[path]["smells"] = [];
        }

        dataByPath[path]["smells"].push({
          x: timestamp,
          y: count,
        });
      }

      // Process other result types
      [
        "qualityResultDocument",
        "securityResultDocument",
        "complexityResultDocument",
        "styleResultDocument",
      ].forEach((docType) => {
        if (combinedItem[docType]) {
          const doc = combinedItem[docType];
          const timestamp = doc.timestamp
            ? new Date(doc.timestamp)
            : combinedTimestamp;
          let count = 0;

          switch (docType) {
            case "qualityResultDocument":
              count = doc.qualityCount || 0;
              break;
            case "securityResultDocument":
              count = doc.vulnerabilitiesCount || 0;
              break;
            case "complexityResultDocument":
              count = doc.cyclomaticComplexity || 0;
              break;
            case "styleResultDocument":
              count = doc.violationCount || 0;
              break;
            default:
              console.warn(`Unrecognized document type: ${docType}`);
              return;
          }

          const resultCategory = docType
            .replace("ResultDocument", "")
            .toLowerCase();

          if (!dataByPath[path][resultCategory]) {
            dataByPath[path][resultCategory] = [];
          }

          const entry = {
            x: timestamp,
            y: count,
          };

          dataByPath[path][resultCategory].push(entry);
        }
      });

      // Sort each result type within combinedResults by timestamp
      Object.keys(dataByPath[path]).forEach((resultType) => {
        if (dataByPath[path][resultType]) {
          dataByPath[path][resultType].sort((a, b) => a.x - b.x);
        }
      });
    });

    return dataByPath;
  };

  const renderLineChart = (data, category) => {
    if (!data[pathInput] || !data[pathInput][category]) {
      return <p>No data available for {category} in this path.</p>;
    }

    const chartData = {
      labels: data[pathInput][category].map((d) => d.x.toLocaleDateString()),
      datasets: [
        {
          label: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
          data: data[pathInput][category].map((d) => d.y),
          fill: false,
          borderColor: getColorForCategory(category),
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };

    return <Line data={chartData} options={options} />;
  };

  const getColorForCategory = (category) => {
    switch (category) {
      case "security":
        return "red";
      case "style":
        return "blue";
      case "smells":
        return "green";
      case "complexity":
        return "purple";
      case "quality":
        return "orange";
      default:
        return "gray";
    }
  };

  const handleInputChange = (event) => {
    const newPath = event.target.value;
    setPathInput(newPath);

    setRepoInfo(null);

    // Update repository information
    for (const key in fullData) {
      const found = fullData[key].find(
        (item) => item.repositoryInfo?.path === newPath
      );
      if (found) {
        setRepoInfo(found.repositoryInfo);
        return;
      }
    }
  };

  return (
    <div className="graph-container">
      <div className="header-and-form-section">
        <h1>Line Graph Trend Visualization</h1>
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

      {repoInfo && (
        <div className="repository-info-section">
          <h2>Repository Information</h2>
          <p>Username: {repoInfo.username}</p>
          <p>Repository: {repoInfo.repo}</p>
          <p>Path: {repoInfo.path}</p>
        </div>
      )}

      {pathInput && (
        <div className="graphs-section">
          <h2>Security Trends</h2>
          {renderLineChart(chartData, "security")}
          <h2>Style Trends</h2>
          {renderLineChart(chartData, "style")}
          <h2>Smells Trends</h2>
          {renderLineChart(chartData, "smells")}
          <h2>Complexity Trends</h2>
          {renderLineChart(chartData, "complexity")}
          <h2>Quality Trends</h2>
          {renderLineChart(chartData, "quality")}
        </div>
      )}
    </div>
  );
};

export default TrendPage;
