import { useState, useEffect } from "react";

const useHeatmapData = (apiUrl) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [xLabels, setXLabels] = useState([
    "Vulnerabilities",
    "Code Smells",
    "Quality Issues",
    "Style Violations",
    "Complexity",
  ]);
  const [yLabels, setYLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        processHeatmapData(
          getMostRecentAnalysisResults(data.securityResults),
          getMostRecentAnalysisResults(data.codeSmellResults),
          getMostRecentAnalysisResults(data.qualityResults),
          getMostRecentAnalysisResults(data.styleResults),
          getMostRecentAnalysisResults(data.complexityResults)
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [apiUrl]);

  function getMostRecentAnalysisResults(results) {
    return results.reduce((acc, current) => {
      const path = current.repositoryInfo.path;
      if (!acc[path] || acc[path].date < current.date) {
        acc[path] = current;
      }
      return acc;
    }, {});
  }

  function processHeatmapData(
    securityResults,
    codeSmellResults,
    qualityResults,
    styleResults,
    complexityResults
  ) {
    const fileSet = new Set();
    const fileCounts = {};

    // Now processing only the most recent analysis results for each file
    Object.values(securityResults).forEach(
      ({ repositoryInfo, vulnerabilitiesCount }) => {
        const { path } = repositoryInfo;
        fileSet.add(path);
        fileCounts[`vulnerabilities::${path}`] = vulnerabilitiesCount;
      }
    );

    Object.values(codeSmellResults).forEach(
      ({ repositoryInfo, smellsCount }) => {
        const { path } = repositoryInfo;
        fileSet.add(path);
        fileCounts[`codeSmells::${path}`] = smellsCount;
      }
    );

    Object.values(qualityResults).forEach(
      ({ repositoryInfo, qualityCount }) => {
        const { path } = repositoryInfo;
        fileSet.add(path);
        fileCounts[`qualityIssues::${path}`] = qualityCount;
      }
    );

    Object.values(styleResults).forEach(
      ({ repositoryInfo, violationCount }) => {
        const { path } = repositoryInfo;
        fileSet.add(path);
        fileCounts[`styleViolations::${path}`] = violationCount;
      }
    );

    Object.values(complexityResults).forEach(
      ({ repositoryInfo, cyclomaticComplexity }) => {
        const { path } = repositoryInfo;
        fileSet.add(path);
        fileCounts[`complexity::${path}`] = cyclomaticComplexity;
      }
    );

    const paths = Array.from(fileSet);
    setYLabels(paths);

    const data = paths.map((path) => [
      fileCounts[`vulnerabilities::${path}`] || 0, // Vulnerabilities count
      fileCounts[`codeSmells::${path}`] || 0, // Code smells count
      fileCounts[`qualityIssues::${path}`] || 0, // Quality issues count
      fileCounts[`styleViolations::${path}`] || 0, // Style violations count
      fileCounts[`complexity::${path}`] || 0, // Cyclomatic complexity
    ]);

    setHeatmapData(data);
  }

  return { heatmapData, xLabels, yLabels, isLoading, error };
};

export default useHeatmapData;
