const QualityIssueDescription = {
  "Duplicate code": {
    description:
      "Duplicate code can lead to maintenance challenges and inconsistencies.",
    solution:
      "Refactor the code by extracting the duplicate parts into a single method or class.",
    codeExample: `// Before Refactoring
      int sum1 = a + b + c;
      int sum2 = x + y + z;

      // After Refactoring
      int sum(int x, int y, int z) {
        return x + y + z;
      }
      int sum1 = sum(a, b, c);
      int sum2 = sum(x, y, z);`,
  },
  "Consider refactoring": {
    description:
      "Refactoring loops to use lambdas and streams can enhance readability and maintainability.",
    solution:
      "Use Java's Stream API to refactor loops for operations like filtering, mapping, and reducing.",
    codeExample: `// Before Refactoring
      for (String item : list) {
        if (item.contains("a")) {
          System.out.println(item);
        }
      }

      // After Refactoring
      list.stream()
        .filter(item -> item.contains("a"))
        .forEach(System.out::println);`,
  },
  "Access modifier": {
    description:
      "Using more restrictive access modifiers enhances encapsulation and security.",
    solution:
      "Limit the visibility of classes, methods, and variables as much as possible.",
    codeExample: `// Before Refactoring
      public int value;

      // After Refactoring
      private int value;`,
  },
};

export default QualityIssueDescription;
