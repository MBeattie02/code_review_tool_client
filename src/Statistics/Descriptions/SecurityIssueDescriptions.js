const SecurityIssueDescriptions = {
  "High entropy": {
    description:
      "High entropy strings suggest complexity and randomness, often seen in security contexts like encryption keys.",
    solution:
      "Avoid embedding sensitive information in the code. Utilize environment variables for storing sensitive data.",
    codeExample:
      "process.env.SECRET_KEY // Use environment variables for sensitive data",
  },
  "Insecure import": {
    description:
      "This refers to the use of external libraries or modules that are outdated or have known security vulnerabilities.",
    solution: "Regularly update your dependencies to their latest versions.",
    codeExample:
      "npm update // Regularly update packages using npm or similar tools",
  },
  "Potential hardcoded": {
    description:
      "Indicates the presence of hard-coded sensitive information like passwords or API keys.",
    solution: "Store sensitive data in secure, external configurations.",
    codeExample:
      "const apiSecret = process.env.API_SECRET // Use environment variables instead of hard-coded secrets",
  },
  "Weak cryptographic": {
    description: "The use of obsolete or insecure cryptographic algorithms.",
    solution: "Transition to current cryptographic standards.",
    codeExample:
      "crypto.createCipheriv('aes-256-gcm', key, iv) // Use modern and secure cryptographic functions",
  },
  "Potential insecure": {
    description:
      "Refers to potentially insecure cryptographic algorithms or practices.",
    solution: "Ensure proper implementation and regular security audits.",
    codeExample:
      "crypto.timingSafeEqual(buffer1, buffer2) // Use timing-safe methods for comparing sensitive data",
  },
  "Potential race": {
    description: "Indicates a race condition vulnerability.",
    solution: "Implement proper synchronization and locking mechanisms.",
    codeExample:
      "mutex.lock(); try { // critical section } finally { mutex.unlock() } // Proper synchronization in multi-threaded environments",
  },
  "Potential SQL": {
    description: "Suggests a risk of SQL injection.",
    solution: "Employ prepared statements and parameterized queries.",
    codeExample:
      "db.query('SELECT * FROM users WHERE id = ?', [userId]) // Use parameterized queries to prevent SQL injection",
  },
  "Potential XSS": {
    description:
      "Indicates the possibility of Cross-Site Scripting (XSS) attacks.",
    solution:
      "Use secure coding practices to validate and sanitize user input.",
    codeExample:
      "const safeInput = sanitizeHtml(userInput) // Sanitize user input to prevent XSS",
  },
};

export default SecurityIssueDescriptions;
