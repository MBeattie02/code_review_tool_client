const ComplexityDescription = [
  {
    min: 1,
    max: 1000,
    description:
      "Cyclomatic complexity is a software metric used to quantify the complexity of a program. Developed by Thomas J. McCabe in 1976, it measures the number of linearly independent paths through a program's source code. This metric is crucial because it provides an insight into the complexity and potential risks associated with maintaining and testing the software. The calculation of cyclomatic complexity is based on the control flow graph of the program, where the formula V(G) = E - N + 2P is used, with E being the number of edges in the graph, N the number of nodes, and P the number of connected components. A higher cyclomatic complexity indicates a program with more paths, and hence, more complex and potentially more difficult to understand, test, and maintain. It's an invaluable tool in software development for identifying parts of the code that are complex and may require refactoring, as well as determining the minimum number of tests needed to achieve thorough coverage.",
  },
  {
    min: 1,
    max: 10,
    description:
      "This code has minimal complexity. Such code usually consists of few conditional statements or loops, making it straightforward to understand, test, and maintain. Ideal for small functions or modules, indicating good coding practices and high maintainability.",
  },
  {
    min: 11,
    max: 20,
    description:
      "This code has a moderate level of complexity. Such code usulaay contains several conditional statements and loops, introducing more paths through the code. While still manageable, the increased number of paths suggests that understanding and testing the code requires more effort compared to low complexity code.",
  },
  {
    min: 21,
    max: 50,
    description:
      "This code has a high level of complexity. Such code is likely to have numerous conditional statements, loops, and possibly nested structures. Such complexity can make the code difficult to understand and maintain, and it poses significant challenges in testing and debugging.",
  },
  {
    min: 51,
    max: 1000,
    description: `
    This code is extremely complex, this range is usually a red flag.
    It may encompass large modules with deeply nested structures,
    multiple control flow paths, and intricate logic.
    Code with very high complexity is often hard to maintain, understand, and test efficiently.
    It's generally advisable to refactor such code to reduce complexity,
    enhancing its readability and maintainability.
  `,
  },
];

export default ComplexityDescription;
