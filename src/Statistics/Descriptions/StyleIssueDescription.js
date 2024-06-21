const StyleIssueDescription = {
  "Incorrect indentation": {
    description:
      "Maintain consistent indentation for improved readability and structure.",
    solution:
      "Use a standard indentation style, like 4 spaces or a tab, consistently throughout your code.",
    codeExample:
      "// Correct indentation\nif (condition) {\n    doSomething();\n}",
  },
  "Class or": {
    description:
      "Class and interface names should start with an uppercase letter.",
    solution: "Rename classes and interfaces to start with uppercase letters.",
    codeExample:
      "class MyClass {} // Class names start with an uppercase letter",
  },
  "Method name": {
    description:
      "Method names should start with a lowercase letter and follow camelCase.",
    solution: "Rename methods to start with a lowercase letter.",
    codeExample:
      "void myMethod() {} // Method names start with a lowercase letter",
  },
  "Magic number": {
    description:
      "Replace magic numbers with named constants for clarity and maintainability.",
    solution:
      "Declare a constant for the magic number and use the constant in place of the number.",
    codeExample:
      "const MAX_HEIGHT = 100; // Replace magic number with a named constant",
  },
  "Opening brace": {
    description: "Place opening braces on the same line as the declaration.",
    solution: "Adjust brace placement to follow the 'end-of-line' style.",
    codeExample:
      "if (condition) { // Opening brace on the same line\n    doSomething();\n}",
  },
  "Import Organisation": {
    description:
      "Organize imports alphabetically for readability and consistency.",
    solution: "Sort your import statements alphabetically.",
    codeExample:
      "import aPackage;\nimport bPackage; // Alphabetically sorted imports",
  },
  "Constant variable": {
    description:
      "Name constant variables in uppercase for clear identification.",
    solution:
      "Use uppercase letters for constant variable names, separating words with underscores.",
    codeExample: "const MAX_COUNT = 10; // Constant variable in uppercase",
  },
  "Variable name": {
    description: "Use camelCase for variable naming to enhance readability.",
    solution:
      "Rename variables to use camelCase, starting with a lowercase letter.",
    codeExample: "let myVariable = 5; // Variable names in camelCase",
  },
  "Local variable": {
    description:
      "Local variables should be named using camelCase for consistency.",
    solution: "Follow camelCase naming for all local variables.",
    codeExample: "int localValue = 10; // Local variable in camelCase",
  },
};

export default StyleIssueDescription;
