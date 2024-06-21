/**
 * Renders the combined results of various analysis documents.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.combinedResponse - The combined response object containing analysis documents.
 * @returns {JSX.Element} The rendered component.
 */
function DisplayCombinedResults({ combinedResponse }) {
  console.log("combinedResponse", combinedResponse);
  if (!combinedResponse || Object.keys(combinedResponse).length === 0) {
    return <p>No data to display</p>;
  }

  const {
    qualityResultDocument,
    codeSmellResultDocument,
    securityResultDocument,
    complexityResultDocument,
    styleResultDocument,
    repositoryInfo,
  } = combinedResponse;

  return (
    <div className="results-container">
      {repositoryInfo && <RepositoryInfo info={repositoryInfo} />}
      {qualityResultDocument && (
        <QualityResult result={qualityResultDocument} />
      )}
      {codeSmellResultDocument && (
        <CodeSmellResult result={codeSmellResultDocument} />
      )}
      {securityResultDocument && (
        <SecurityResult result={securityResultDocument} />
      )}
      {complexityResultDocument && (
        <ComplexityResult result={complexityResultDocument} />
      )}
      {styleResultDocument && <StyleResult result={styleResultDocument} />}
    </div>
  );
}

/**
 * Renders the quality results component.
 * @param {Object} props - The component props.
 * @param {Object} props.result - The result object containing quality issues.
 * @returns {JSX.Element|null} The quality results component.
 */
function QualityResult({ result }) {
  if (!result || !result.duplications) return null;
  return (
    <div className="result-card">
      <h3>Quality Results</h3>
      <ul>
        {result.duplications.map((duplication, index) => (
          <li key={index}>{duplication}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Renders the code smell results.
 * @param {Object} props - The component props.
 * @param {Object} props.result - The code smell result object.
 * @returns {JSX.Element|null} The code smell result component.
 */
function CodeSmellResult({ result }) {
  if (!result || !result.smells) return null;
  return (
    <div className="result-card">
      <h3>Code Smell Results</h3>
      <ul>
        {result.smells.map((smell, index) => (
          <li key={index}>{smell}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Renders the security results component.
 * @param {Object} result - The result object containing security information.
 * @returns {JSX.Element|null} The rendered security results component or null if there are no vulnerabilities.
 */
function SecurityResult({ result }) {
  if (!result || !result.vulnerabilities) return null;
  return (
    <div className="result-card">
      <h3>Security Results</h3>
      <ul>
        {result.vulnerabilities.map((vulnerability, index) => (
          <li key={index}>{vulnerability}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Renders the complexity result component.
 * @param {Object} props - The component props.
 * @param {Object} props.result - The complexity result object.
 * @returns {JSX.Element|null} The complexity result component.
 */
function ComplexityResult({ result }) {
  if (!result) return null;
  return (
    <div className="result-card">
      <h3>Complexity Results</h3>
      <p>Cyclomatic Complexity: {result.cyclomaticComplexity}</p>
    </div>
  );
}

/**
 * Renders the style results component.
 * @param {Object} props - The component props.
 * @param {Object} props.result - The result object containing style violations.
 * @returns {JSX.Element|null} The rendered style results component or null if there are no violations.
 */
function StyleResult({ result }) {
  if (!result || !result.violations || result.violations.length === 0)
    return null;
  return (
    <div className="result-card">
      <h3>Style Results</h3>
      <ul>
        {result.violations.map((violations, index) => (
          <li key={index}>{violations}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Renders the repository information.
 *
 * @param {Object} info - The repository information object.
 * @param {string} info.username - The username of the repository owner.
 * @param {string} info.repo - The name of the repository.
 * @param {string} info.commitId - The commit ID of the repository.
 * @param {string} info.path - The path of the repository.
 * @returns {JSX.Element|null} The rendered repository information component.
 */
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

export default DisplayCombinedResults;
