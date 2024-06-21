import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import QueryForm from "./QueryForm/QueryForm";
import GraphPage from "./Graph/GraphPage";
import TrendPage from "./Graph/TrendPage";
import StatPage from "./Statistics/StatPage";
import CorrelationPage from "./Correlation/CorrelationPage";
import RetrievePreviousResults from "./RetrievePreviousResultsMongo/RetrievePreviousResults";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} exact />
        <Route path="/query-form" element={<QueryForm />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/trend" element={<TrendPage />} />
        <Route path="/stat" element={<StatPage />} />
        <Route path="/correlation" element={<CorrelationPage />} />
        <Route
          path="/retrieve-previous"
          element={<RetrievePreviousResults />}
        />
      </Routes>
    </Router>
  );
}

export default App;
