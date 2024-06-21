import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./QueryForm.css";
import AllResults from "../AnalysisResults/AllResults";
import SecurityResults from "../AnalysisResults/SecurityResults";
import StyleResults from "../AnalysisResults/StyleResults";
import ComplexityResults from "../AnalysisResults/ComplexityResults";
import CodeSmellsResults from "../AnalysisResults/SmellsResults";
import QualityResults from "../AnalysisResults/QualityResults";
import RawCodeModal from "../RawCodeModal/RawCodeModal";

/**
 * Represents a QueryForm component.
 *
 * @component
 * @returns {JSX.Element} QueryForm component
 */
function QueryForm() {
  // State for form data

  const [directoryContents, setDirectoryContents] = useState({});

  const [formData, setFormData] = useState({
    username: "",
    repo: "",
    commitId: "",
    path: "",
    endpoint: "/analyse-security",
  });

  // GitHub token from environment variables
  const githubToken = process.env.REACT_APP_GITHUB_TOKEN;

  // State for loading, error, and response status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // State for repository, branch, and file lists
  const [repoList, setRepoList] = useState([]);
  const [branchList, setBranchList] = useState([]);

  // State for scheduling time and toggle
  const [scheduleTime, setScheduleTime] = useState("");
  const [isScheduled, setIsScheduled] = useState(false); // Toggle for scheduling

  const [shouldPostComment, setShouldPostComment] = useState(true); // Default to true

  // Navigation hook from react-router-dom
  const navigate = useNavigate();

  // Function to fetch repositories of a user
  const fetchRepositories = useCallback(
    async (username) => {
      try {
        // Making a GET request to GitHub API to fetch repositories
        const response = await axios.get(
          `https://api.github.com/users/${username}/repos?per_page=100`,
          {
            headers: {
              Authorization: `Bearer ${githubToken}`, // Authorization header with GitHub token
            },
          }
        );
        // Setting the repository list with the fetched data
        setRepoList(response.data.map((repo) => repo.name));
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    },
    [githubToken]
  );

  // Fetch branches
  const fetchBranches = useCallback(
    async (username, repo) => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${username}/${repo}/branches`,
          {
            headers: {
              Authorization: `Bearer ${githubToken}`,
            },
          }
        );
        setBranchList(response.data.map((branch) => branch.name));
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    },
    [githubToken]
  );

  const fetchFiles = useCallback(
    async (username, repo, commitId, path = "") => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${username}/${repo}/contents/${path}?ref=${commitId}`,
          {
            headers: {
              Authorization: `Bearer ${githubToken}`,
            },
          }
        );

        setDirectoryContents((prev) => ({
          ...prev,
          [path]: response.data,
        }));
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    },
    [githubToken]
  );

  const renderDropdowns = () => {
    return Object.keys(directoryContents).map((path, index) => (
      <select
        key={path}
        name={`path-${index}`}
        onChange={(e) => handleDirectoryChange(e, path)}
      >
        <option value="">Select...</option>
        {directoryContents[path].map((item) => (
          <option key={item.path} value={item.path}>
            {item.name}
          </option>
        ))}
      </select>
    ));
  };

  const handleDirectoryChange = (e, currentPath) => {
    const selectedPath = e.target.value;
    const selectedItem = directoryContents[currentPath]?.find(
      (item) => item.path === selectedPath
    );

    if (selectedItem) {
      if (selectedItem.type === "dir") {
        fetchFiles(
          formData.username,
          formData.repo,
          formData.commitId,
          selectedPath
        );
      } else {
        // Update formData with the selected file path
        setFormData({ ...formData, selectedFile: selectedItem.path });
      }
    }
  };

  // Effect hook to fetch repositories when username changes
  useEffect(() => {
    if (formData.username) {
      fetchRepositories(formData.username);
      setDirectoryContents({});
      setFormData((prevFormData) => ({
        ...prevFormData,
        commitId: "",
      }));
    }
  }, [formData.username, fetchRepositories]);

  // Effect hook to fetch branches when repository changes
  useEffect(() => {
    if (formData.repo) {
      fetchBranches(formData.username, formData.repo);
    }
  }, [formData.username, formData.repo, fetchBranches]);

  // Effect hook to fetch files when commit ID changes
  useEffect(() => {
    if (formData.commitId) {
      fetchFiles(formData.username, formData.repo, formData.commitId);
    }
  }, [formData.username, formData.repo, formData.commitId, fetchFiles]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "repo" && value) {
      handleRepositoryChange(value);
    } else if (name === "commitId" && value) {
      fetchFiles(formData.username, formData.repo, value);
    }
  };

  const handleRepositoryChange = async (repo) => {
    setDirectoryContents({});
    setBranchList([]);
    setResponse(null);

    try {
      // Fetch the details of the selected repository to get the default branch
      const repoDetails = await axios.get(
        `https://api.github.com/repos/${formData.username}/${repo}`,
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
          },
        }
      );

      const defaultBranch = repoDetails.data.default_branch;

      // Update formData with the default branch
      setFormData((prevFormData) => ({
        ...prevFormData,
        repo,
        commitId: defaultBranch,
      }));

      // Fetch branches and files for the new repository and its default branch
      fetchBranches(formData.username, repo);
      fetchFiles(formData.username, repo, defaultBranch);
    } catch (error) {
      console.error("Error fetching repository details:", error);
      setError("Error fetching repository details");
    }
  };

  // Initialize form data with default values
  const initialFormData = {
    username: "",
    repo: "",
    commitId: "",
    path: "",
    endpoint: "/analyse-security",
    selectedFile: "",
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const { username, repo, commitId, selectedFile, endpoint } = formData;

    // Check if username, repo, commitId, and selectedFile are filled
    if (!username || !repo || !commitId || !selectedFile) {
      setError("Please fill in all the required fields.");
      setIsLoading(false);
      return;
    }

    let response;
    try {
      const apiUrl = `${process.env.REACT_APP_URL}/api${endpoint}`;
      const queryParameters = new URLSearchParams({
        username,
        repo,
        commitId,
        path: selectedFile,
        shouldPostComment: shouldPostComment,
      }).toString();

      if (isScheduled) {
        // Schedule analysis
        const data = {
          username,
          repo,
          commitId,
          path: selectedFile,
          endpoint,
          scheduleTime: scheduleTime,
          shouldPostComment,
        };
        response = await axios.post(
          `${process.env.REACT_APP_URL}/api/schedule-analysis`,
          data
        );
        setFormData(initialFormData);
        setScheduleTime("");
        setDirectoryContents({});
        setRepoList([]);
        setBranchList([]);
        setShouldPostComment(shouldPostComment);
      } else {
        // Perform immediate analysis
        response = await axios.get(`${apiUrl}?${queryParameters}`);
      }

      setResponse(response.data);
      alert(
        isScheduled ? "Analysis scheduled successfully" : "Analysis started"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle changes in date/time for scheduling
  const handleDateTimeChange = (e) => {
    setScheduleTime(e.target.value);
  };

  // Handle endpoint selection change
  const handleEndpointChange = (e) => {
    setResponse(null); // Clear the results
    setFormData({ ...formData, endpoint: e.target.value });
  };

  // Clear the results
  const clearResults = () => {
    setResponse(null);
  };

  // Toggle between scheduled and immediate analysis
  const handleScheduleToggle = () => {
    setIsScheduled(!isScheduled);
    setResponse(null);

    setFormData(initialFormData);

    setDirectoryContents({});

    setRepoList([]);
    setBranchList([]);
  };

  function extractIssueLines(response) {
    const issueLines = new Set(); // Using a Set to avoid duplicate line numbers

    const addLinesFromPart = (part) => {
      if (Array.isArray(part)) {
        part.forEach((item) => {
          const match = item.match(/Violation at line (\d+)/);
          if (match) {
            issueLines.add(parseInt(match[1]));
          }
        });
      }
    };

    // Check if response and its properties exist before attempting to extract lines
    if (response) {
      addLinesFromPart(response.vulnerabilities);
      addLinesFromPart(response.smells);
      addLinesFromPart(response.violations);
      addLinesFromPart(response.duplications);
      if (response.qualityResult) {
        addLinesFromPart(response.qualityResult.duplications);
      }
      if (response.qualityResult) {
        addLinesFromPart(response.qualityResult.duplications);
      }
      if (response.codeSmellResult) {
        addLinesFromPart(response.codeSmellResult.smells);
      }
      if (response.styleResult) {
        addLinesFromPart(response.styleResult.violations);
      }
    }

    return Array.from(issueLines);
  }

  // Handle form submission
  function DisplayResults({ response }) {
    const [showModal, setShowModal] = useState(false);
    const [rawCode, setRawCode] = useState("");

    const viewRawCode = async () => {
      try {
        //const rawCodeUrl = `https://raw.githubusercontent.com/${formData.username}/${formData.repo}/${formData.commitId}/${formData.path}`;
        const rawCodeUrl = `${process.env.REACT_APP_URL}/raw/githubusercontent?username=${formData.username}&repo=${formData.repo}&commitId=${formData.commitId}&path=${formData.selectedFile}`;
        const rawCodeResponse = await axios.get(rawCodeUrl);
        setRawCode(rawCodeResponse.data);
        setShowModal(true); // Show the modal with the raw code
      } catch (error) {
        console.error("Error fetching raw code:", error);
      }
    };

    const issueLines = extractIssueLines(response);

    const handleCloseModal = () => {
      setShowModal(false);
    };
    if (isScheduled) {
      // Display a message for scheduled analysis
      return (
        <div className="centered-message">
          Scheduled Analysis Results can be viewed in the previous results
          section after execution.
        </div>
      );
    }
    if (!response) return null;

    return (
      <div>
        {/* Render analysis results based on the selected endpoint */}
        {formData.endpoint === "/analyse-security" && (
          <SecurityResults data={response} />
        )}
        {formData.endpoint === "/analyse-style" && (
          <StyleResults data={response} />
        )}
        {formData.endpoint === "/analyse-complexity" && (
          <ComplexityResults data={response} />
        )}
        {formData.endpoint === "/analyse-code-smells" && (
          <CodeSmellsResults data={response} />
        )}
        {formData.endpoint === "/analyse-quality" && (
          <QualityResults data={response} />
        )}
        {formData.endpoint === "/analyse-all" && <AllResults data={response} />}

        {/* Button to view raw code */}
        <button onClick={viewRawCode} className="view-raw-code-button">
          View Raw Code
        </button>

        {/* Modal for displaying raw code */}
        {showModal && (
          <RawCodeModal
            code={rawCode}
            onClose={handleCloseModal}
            issueLines={issueLines}
          />
        )}
      </div>
    );
  }

  // Navigate to home page
  const goToHomePage = () => {
    navigate("/");
  };

  // JSX for rendering the component
  return (
    <div>
      <div className="container">
        <h1 className="form-title">Static Analyser Tool</h1>
      </div>
      <div className="button-container-home">
        <button onClick={goToHomePage} className="return-home-button">
          Return to Homepage
        </button>
      </div>

      <div className="datetime-container">
        <label className="schedule-label">
          Schedule this task?
          <input
            type="checkbox"
            checked={isScheduled}
            onChange={handleScheduleToggle}
            className="schedule-checkbox"
          />
        </label>

        {isScheduled && (
          <input
            type="datetime-local"
            value={scheduleTime}
            onChange={handleDateTimeChange}
            className="simple-datetime-picker"
          />
        )}
      </div>

      <form onSubmit={handleSubmit} className="query-form">
        <label className="checkbox-label">
          <span className="checkbox-text">Post Results With GitHub Commet</span>
          <input
            type="checkbox"
            checked={shouldPostComment}
            onChange={(e) => setShouldPostComment(e.target.checked)}
            className="checkbox-input"
          />
          <span className="checkmark"></span>
        </label>

        {/* Dropdown for selecting analysis type */}
        <select
          name="endpoint"
          value={formData.endpoint}
          onChange={handleEndpointChange}
        >
          <option value="/analyse-security">Analyse Security</option>
          <option value="/analyse-style">Analyse Style</option>
          <option value="/analyse-complexity">Analyse Complexity</option>
          <option value="/analyse-code-smells">Analyse Code Smells</option>
          <option value="/analyse-quality">Analyse Quality</option>
          <option value="/analyse-all">Analyse All</option>
        </select>

        {/* Input for GitHub Username */}
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="GitHub Username"
        />

        {/* Dropdown for selecting a repository */}
        {formData.username && (
          <select name="repo" value={formData.repo} onChange={handleChange}>
            <option value="">Select a Repository</option>
            {repoList.map((repo) => (
              <option key={repo} value={repo}>
                {repo}
              </option>
            ))}
          </select>
        )}

        {/* Dropdown for selecting a branch */}
        {formData.repo && (
          <select
            name="commitId"
            value={formData.commitId}
            onChange={(e) => {
              handleChange(e);
              fetchFiles(formData.username, formData.repo, e.target.value);
            }}
          >
            <option value="">Select a Branch</option>
            {branchList.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        )}

        {renderDropdowns()}
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? "Loading..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={clearResults}
          className="clear-results-button"
        >
          Clear Results
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

      {/* Displaying the API response} */}
      <DisplayResults response={response} />
    </div>
  );
}

export default QueryForm;
