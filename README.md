# Static Analyser Front-End

This project is the front-end component of a static analyser tool, developed using React. It provides a user-friendly interface for interacting with the static analysis features provided by the Java backend. This allows for analysis to be started aswell as retreiving previous analysis from MongoDB database.

## Features

- Analysis Dashboard: Interactive dashboard to select what part of tool to interact with .
- Query Form: Immediate display of analysis results with detailed insights.
- Retreive Previous Results: Allow previous results to be retreived with corresponding MongoDB ID or customID
- Trend Analysis: View how changes to the code base affect the number of issues detected in code base
- Graph Analysis: Visually view the number of issues detected in each analysis run for a given class
- Statistics Analysis: View the vulnerability which is most frequent in the codebases analysed
- Results Correlation: Check for any correlation between different types of analysis

- Error Handling: Front end error handling if user enters incorrect details

## Installation

Clone the repository:

```bash
  git clone https://gitlab.eeecs.qub.ac.uk/40293324/analyser_tool_client
```

Navigate to the project directory:

```bash
  cd clientside
```

Install dependencies:

```bash
  npm install
```

## Run Locally

Start the React application:

```bash
  npm start
```

The application will be available at http://localhost:3000.

## Usage

After starting the application, navigate to the web interface to submit code repositories to be scanned for static analysis. The results will be displayed on the dashboard.
