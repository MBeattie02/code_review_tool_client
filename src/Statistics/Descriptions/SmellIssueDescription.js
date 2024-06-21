const SmellIssueDescription = {
  "Method Parameters": {
    description:
      "Methods with too many parameters can be hard to understand and maintain.",
    solution: "Consider using a parameter object or the Builder pattern.",
    codeExample: `// Before: Method with too many parameters
      public void createAccount(String username, String password, String email, String phone, String address) {
        // method body
      }

      // After: Using a parameter object
      public void createAccount(UserAccount account) {
        // method body using account object
      }`,
  },
  "Method Length": {
    description: "Long methods are difficult to read, understand, and debug.",
    solution: "Break down the method into smaller, more focused methods.",
    codeExample: `// Before: Long method
      public void processData() {
        // multiple tasks mixed together
      }

      // After: Refactored into smaller methods
      public void processData() {
        taskOne();
        taskTwo();
        taskThree();
      }

      private void taskOne() { /* Task one implementation */ }
      private void taskTwo() { /* Task two implementation */ }
      private void taskThree() { /* Task three implementation */ }`,
  },
  "God Class": {
    description:
      "A 'God Class' centralizes too much functionality and is difficult to maintain.",
    solution: "Decompose the class into smaller, cohesive classes.",
    codeExample: `// Before: God Class
      public class AllInOne {
        // too many responsibilities
      }

      // After: Decomposed classes
      public class ResponsibilityOne { /* ... */ }
      public class ResponsibilityTwo { /* ... */ }
      public class ResponsibilityThree { /* ... */ }`,
  },
  "Large Class": {
    description: "Large classes handle too many responsibilities.",
    solution: "Refactor the class into smaller, more manageable classes.",
    codeExample: `// Before: Large class
      public class OverloadedClass {
        // too many methods and variables
      }

      // After: Smaller, focused classes
      public class FocusedClassOne { /* ... */ }
      public class FocusedClassTwo { /* ... */ }`,
  },
  "Try Block": {
    description:
      "Empty or comment-only try blocks may lead to silent failures.",
    solution: "Properly handle exceptions in the try block.",
    codeExample: `// Before: Empty try block
      try {
        // risky operation
      } catch (Exception e) {
        // empty or only a comment
      }

      // After: Proper exception handling
      try {
        // risky operation
      } catch (Exception e) {
        logError(e);
        // or handle exception appropriately
      }`,
  },
  "Data Clumps": {
    description:
      "Data clumps occur when multiple variables are often used together but not organized as an object.",
    solution: "Encapsulate them into a class.",
    codeExample: `// Before: Data clump
      public void processUser(String name, String email, String address) {
        // use name, email, address together
      }

      // After: Encapsulated in a class
      public void processUser(User user) {
        // use user object
      }`,
  },
  "Primitive Obsession": {
    description:
      "Overuse of primitives instead of small objects for simple tasks.",
    solution: "Use classes or enums to represent complex ideas.",
    codeExample: `// Before: Primitive Obsession
      public void setTemperature(int temperature) {
        // use temperature
      }

      // After: Using a class
      public void setTemperature(Temperature temperature) {
        // use Temperature object
      }`,
  },
  "Javadoc Class": {
    description: "Missing Javadoc documentation for classes.",
    solution: "Add Javadoc comments to classes, especially public APIs.",
    codeExample: `// Before: No Javadoc
      public class User {
        // class content
      }

      // After: With Javadoc
      /**
       * Represents a user in the system.
       */
      public class User {
        // class content
      }`,
  },
  "Javadoc Method": {
    description: "Methods without Javadoc documentation can be unclear.",
    solution: "Document methods, especially public ones.",
    codeExample: `// Before: No Javadoc
      public void createUser(String username) {
        // method content
      }

      // After: With Javadoc
      /**
       * Creates a new user with the given username.
       * @param username the username of the new user
       */
      public void createUser(String username) {
        // method content
      }`,
  },
  "Dead Method": {
    description:
      "A method that is never used often indicates unnecessary or obsolete code. It can be a candidate for removal to clean up the codebase.",
    solution:
      "Identify and remove dead methods from the code. Regularly review the codebase for unused methods and consider tools for static code analysis to automate this process.",
    codeExample: `// Before: Dead method
      function unusedMethod() {
          // method body
      }
      
      // After: The method is removed if it's not used`,
  },
  "Excessive Method": {
    description:
      "Too many methods chained together in a single expression can lead to code that is hard to read and debug. It may also indicate a violation of the Law of Demeter, suggesting over-coupling between classes.",
    solution:
      "Break down the method chain into separate statements to enhance readability and maintainability. Consider redesigning the class structure to reduce coupling.",
    codeExample: `// Before: Excessive method chaining
      object.methodOne().methodTwo().methodThree();
  
      // After: Breaking down the chain
      const intermediateResult = object.methodOne();
      intermediateResult.methodTwo();
      intermediateResult.methodThree();`,
  },
  "Generic catch": {
    description:
      "A catch block that is too general, such as catching a broad Exception type, can obscure the specific nature of errors and make debugging more difficult. It's usually better to catch specific exceptions.",
    solution:
      "Refine catch blocks to handle specific exceptions. This approach aids in precise error handling and improves the clarity and safety of the error-handling logic.",
    codeExample: `// Before: Generic catch block
      try {
          // risky code
      } catch (error) {
          // handling
      }
  
      // After: Catching specific errors
      try {
          // risky code
      } catch (specificError) {
          // specific handling
      }`,
  },
  "Empty catch": {
    description:
      "An empty catch block captures an exception but does nothing with it, often leading to swallowed errors and making debugging challenging.",
    solution:
      "Ensure that catch blocks appropriately log or handle the exception. Avoid leaving catch blocks empty to prevent silent failures.",
    codeExample: `// Before: Empty catch block
      try {
          // risky code
      } catch (error) {
          // empty
      }
  
      // After: Logging the error
      try {
          // risky code
      } catch (error) {
          console.error("Error occurred:", error);
      }`,
  },
  "Swallowed exception": {
    description:
      "Similar to an empty catch block, this involves catching an exception but not adequately handling it, such as logging it without addressing the underlying issue, which can hide problems in the code.",
    solution:
      "Properly address exceptions by logging detailed information and re-throwing them when necessary. Ensure that all caught exceptions are either handled or documented for future handling.",
    codeExample: `// Before: Swallowed exception
      try {
          // risky code
      } catch (error) {
          console.error("Error occurred");
      }
  
      // After: Properly handling the exception
      try {
          // risky code
      } catch (error) {
          console.error("Error occurred:", error);
          throw error; // re-throwing the error
      }`,
  },
};

export default SmellIssueDescription;
