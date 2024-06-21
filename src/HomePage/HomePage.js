/**
 * Renders the home page component.
 * @returns {JSX.Element} The rendered home page component.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import queryFormBackground from "./Images/icons8-magnifying-glass-500.png";
import database from "./Images/icons8-database-100.png";
import statistics from "./Images/icons8-statistics-90.png";
import bargraph from "./Images/icons8-bar-chart-100.png";
import charts from "./Images/icons8-graph-100.png";
import correlation from "./Images/icons8-data-correlation-64.png";

const HomePage = () => {
  const navigate = useNavigate();

  // Function to navigate to QueryForm
  const goToQueryForm = () => {
    navigate("/query-form");
  };

  // Function to navigate to GraphPage
  const goToGraphPage = () => {
    navigate("/graph");
  };

  // Function to navigate to TrendPage
  const goToTrendPage = () => {
    navigate("/trend");
  };

  // Function to navigate to MongoPage
  const goToMongoPage = () => {
    navigate("/retrieve-previous");
  };

  // Function to navigate to StatPage
  const goToStatPage = () => {
    navigate("/stat");
  };

  // Function to navigate to CorrelationPage
  const goToCorrelationPage = () => {
    navigate("/correlation");
  };

  // Render the HomePage component
  return (
    <div className="home-page-container">
      <div className="home-page-header">
        <h1>Static Analyser Tool</h1>
      </div>
      <div className="home-page-description">
        <p>
          Welcome to the Static Analyser Tool. This tool provides a solution for
          Java code analysis interacting with github. This tool helps you
          identify potential issues and maintain coding standards. Explore the
          available features and enhance your coding experience!
        </p>
      </div>
      <div className="home-page-column">
        <div
          className="tile-button"
          style={{ backgroundImage: `url(${queryFormBackground})` }}
          onClick={goToQueryForm}
        >
          <div className="tile-label">View Query Form</div>
          <div className="tile-description">
            QueryForm to perform analysis of Github repo
          </div>
        </div>
        <div
          className="tile-button"
          style={{ backgroundImage: `url(${bargraph})` }}
          onClick={goToGraphPage}
        >
          <div className="tile-label">View Graph Analysis</div>
          <div className="tile-description">
            View graph analysis for previous classses
          </div>
        </div>
      </div>
      <div className="home-page-column">
        <div
          className="tile-button"
          style={{ backgroundImage: `url(${charts})` }}
          onClick={goToTrendPage}
        >
          <div className="tile-label">View Trend Analysis</div>
          <div className="tile-description">
            View Trends for previous Analysis
          </div>
        </div>
        <div
          className="tile-button"
          style={{ backgroundImage: `url(${statistics})` }}
          onClick={goToStatPage}
        >
          <div className="tile-label">View Statistics Analysis</div>
          <div className="tile-description">
            View Statistics for previous Analysis
          </div>
        </div>
      </div>
      <div className="home-page-column">
        <div
          className="tile-button"
          style={{ backgroundImage: `url(${database})` }}
          onClick={goToMongoPage}
        >
          <div className="tile-label">View Previous Results</div>
          <div className="tile-description">
            Retreive Previous Results using ID
          </div>
        </div>
        <div
          className="tile-button"
          style={{ backgroundImage: `url(${correlation})` }}
          onClick={goToCorrelationPage}
        >
          <div className="tile-label">View Results Correlation</div>
          <div className="tile-description">
            View Correlation between different analysis types
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
