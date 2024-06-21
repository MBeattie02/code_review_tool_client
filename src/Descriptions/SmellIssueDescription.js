const SmellIssueDescription = {
  "Method Parameters":
    "When a method has too many parameters, it can be difficult to understand and maintain. A long parameter list may also indicate that the method is doing too much and potentially violates the Single Responsibility Principle.",
  "Method Length":
    "A method that is too long is often a sign of poor organization. Long methods are harder to read, understand, and debug. They may encompass multiple functionalities, which should ideally be separated into smaller, more focused methods.",
  "God Class":
    "A 'God Class' is an anti-pattern where a class knows too much or does too much. It's a large class that tends to centralize the functionality of a program and can be difficult to maintain or extend.",
  "Large Class":
    "Similar to a God Class, a Large Class is overly extensive in terms of the number of lines of code. This often indicates that the class is handling too many responsibilities and should be refactored into smaller, more manageable classes.",
  "Try Block":
    "An empty or comment-only try block may indicate an incomplete implementation or an error being improperly handled. This can lead to silent failures and bugs that are hard to track.",
  "Data Clumps":
    "Data clumps occur when groups of variables are frequently used together but not structured as an object. This can be a sign that these variables should be encapsulated into a class to better represent their relationship and to enhance code reusability and clarity.",
  "Primitive Obsession":
    "This issue arises when primitive data types are overused to represent complex ideas in the domain, rather than using classes or enums. This can lead to less expressive and less maintainable code.",
  "Javadoc Class":
    "A class missing Javadoc documentation can be problematic in terms of maintainability and usability, especially in large codebases or public APIs, where clear documentation is essential.",
  "Javadoc Method":
    "Similar to classes, methods without Javadoc documentation can hinder understanding and proper usage of the method, especially if the method’s purpose, parameters, and return values are not immediately clear from its name and context.",
  "Dead Method":
    "A method that is never used (also known as a dead method) often indicates unnecessary or obsolete code. It can be a candidate for removal to clean up the codebase.",
  "Excessive method":
    "Too many methods chained together in a single expression (method chaining) can lead to code that is hard to read and debug. It may also indicate a violation of the Law of Demeter, suggesting over-coupling between classes.",
  "Generic catch":
    "A catch block that is too general, such as catching a broad Exception type, can obscure the specific nature of errors and make debugging more difficult. It's usually better to catch specific exceptions.",
  "Empty catch":
    "An empty catch block captures an exception but does nothing with it, often leading to swallowed errors and making debugging challenging.",
  "Swallowed exception":
    "Similar to an empty catch block, this involves catching an exception but not adequately handling it, such as logging it without addressing the underlying issue, which can hide problems in the code.",
};

export default SmellIssueDescription;
