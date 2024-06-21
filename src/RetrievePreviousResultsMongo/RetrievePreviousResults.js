import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SecurityResults from "../AnalysisResults/SecurityResults";
import StyleResults from "../AnalysisResults/StyleResults";
import ComplexityResults from "../AnalysisResults/ComplexityResults";
import CodeSmellsResults from "../AnalysisResults/SmellsResults";
import QualityResults from "../AnalysisResults/QualityResults";
import CombinedResults from "../AnalysisResults/CombinedResults";
import RawCodeModal from "../RawCodeModal/RawCodeModal";

import "./RetrievePreviousResults.css";

/**
 * Component for retrieving and displaying previous analysis results based on MongoDB ID.
 * @param {Object} props - The component props.
 * @param {Function} props.onClearResults - Callback function to clear the results.
 * @returns {JSX.Element} The RetrievePreviousResults component.
 */
function RetrievePreviousResults({ onClearResults }) {
  // State variables for loading status, MongoDB ID, previous result, error and response
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [previousResult, setPreviousResult] = useState(null);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  // Hook to navigate between routes
  const navigate = useNavigate();

  const [showRawCodeModal, setShowRawCodeModal] = useState(false);
  const [rawCode, setRawCode] = useState("");

  const [issueLines, setIssueLines] = useState([]);

  const parseIssues = (result) => {
    const issueTypes = [
      "duplications",
      "violations",
      "smells",
      "vulnerabilities",
    ];
    let issues = [];
    for (const issueType of issueTypes) {
      if (result && result[issueType]) {
        issues = issues.concat(result[issueType]);
        break;
      }
    }

    return issues
      .map((issue) => {
        const match = issue.match(/Violation at line (\d+):/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((line) => line !== null);
  };

  const viewRawCode = async () => {
    // Check if there's any result with repository information
    const resultWithRepoInfo = [
      previousResult.securityResult,
      previousResult.complexityResult,
      previousResult.codeSmellResult,
      previousResult.qualityResult,
      previousResult.styleResult,
      previousResult.combinedResult,
    ].find((result) => result && result.repositoryInfo);

    if (!resultWithRepoInfo) {
      alert("No repository information available to fetch raw code");
      return;
    }

    const { username, repo, commitId, path } =
      resultWithRepoInfo.repositoryInfo;
    const rawCodeUrl = `${process.env.REACT_APP_URL}/raw/githubusercontent?username=${username}&repo=${repo}&commitId=${commitId}&path=${path}`;
    try {
      const response = await axios.get(rawCodeUrl);
      setRawCode(response.data);
      let allIssueLines = [];
      // Check and parse each result type
      if (previousResult.qualityResult) {
        allIssueLines = allIssueLines.concat(
          parseIssues(previousResult.qualityResult)
        );
      }
      if (previousResult.codeSmellResult) {
        allIssueLines = allIssueLines.concat(
          parseIssues(previousResult.codeSmellResult)
        );
      }
      if (previousResult.styleResult) {
        allIssueLines = allIssueLines.concat(
          parseIssues(previousResult.styleResult)
        );
      }
      if (previousResult.securityResult) {
        allIssueLines = allIssueLines.concat(
          parseIssues(previousResult.securityResult)
        );
      }
      if (previousResult.combinedResult) {
        allIssueLines = allIssueLines.concat(
          parseIssues(previousResult.combinedResult.qualityResultDocument)
        );
        allIssueLines = allIssueLines.concat(
          parseIssues(previousResult.combinedResult.codeSmellResultDocument)
        );
        allIssueLines = allIssueLines.concat(
          parseIssues(previousResult.combinedResult.securityResultDocument)
        );
        allIssueLines = allIssueLines.concat(
          parseIssues(previousResult.combinedResult.styleResultDocument)
        );
      }

      // Remove duplicates and update state
      const uniqueIssueLines = Array.from(new Set(allIssueLines));
      setIssueLines(uniqueIssueLines);
      setShowRawCodeModal(true);
    } catch (error) {
      console.error("Error fetching raw code:", error);
      alert("Failed to fetch raw code");
    }
  };

  // Fetch result based on MongoDB ID or custom ID
  const fetchResult = async () => {
    if (!inputValue) {
      alert("Please enter a MongoDB ID or a Custom ID");
      return;
    }
    setIsLoading(true);

    try {
      let url;
      // Check if the input is a custom ID
      if (inputValue.includes("-")) {
        url = `${process.env.REACT_APP_URL}/api/results-all/custom/${inputValue}`;
      } else {
        // Assume it's a MongoDB ID
        url = `${process.env.REACT_APP_URL}/api/results-all/${inputValue}`;
      }

      const response = await axios.get(url);
      setPreviousResult(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching result:", error);
      setError("Failed to fetch data");
      setPreviousResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to navigate to the homepage
  const goToHomePage = () => {
    navigate("/"); // Navigate to the homepage
  };

  /**
   * Renders the results of various analysis categories.
   * @param {Object} props - The component props.
   * @param {Object} props.data - The data containing the results.
   * @returns {JSX.Element|null} The rendered component.
   */
  function DisplayResultsMongo({ data }) {
    if (!data) return null;

    return (
      <div>
        {data.securityResult && <SecurityResults data={data.securityResult} />}
        {data.complexityResult && (
          <ComplexityResults data={data.complexityResult} />
        )}
        {data.codeSmellResult && (
          <CodeSmellsResults data={data.codeSmellResult} />
        )}
        {data.qualityResult && <QualityResults data={data.qualityResult} />}
        {data.styleResult && <StyleResults data={data.styleResult} />}
        {data.combinedResult && <CombinedResults data={data.combinedResult} />}
      </div>
    );
  }

  // Clear the results
  const clearResultsMongo = () => {
    setResponse(null);
    setPreviousResult(null);
  };

  return (
    <div className="container">
      <button onClick={goToHomePage} className="button home-button">
        Return to Homepage
      </button>
      <p>Enter MongoDB ID or Custom ID to fetch results</p>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="MongoDB ID or Custom ID"
        className="input-field"
      />
      <button
        type="button"
        onClick={fetchResult}
        disabled={isLoading}
        className="fetch-mongo-button"
      >
        {isLoading ? "Fetching..." : "Fetch Result"}
      </button>
      <button
        type="button"
        onClick={clearResultsMongo}
        disabled={isLoading}
        className="clear-mongo-button"
      >
        {isLoading ? "Clearing..." : "Clear Result"}
      </button>

      {error && <div className="error-message">{error}</div>}

      {previousResult && (
        <div className="previous-result">
          <DisplayResultsMongo data={previousResult} />
          <button
            type="button"
            onClick={viewRawCode}
            disabled={!previousResult}
            className="view-raw-code-button"
          >
            View Raw Code
          </button>

          {showRawCodeModal && (
            <RawCodeModal
              code={rawCode}
              issueLines={issueLines} // Pass issue lines to the modal
              onClose={() => setShowRawCodeModal(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default RetrievePreviousResults;
