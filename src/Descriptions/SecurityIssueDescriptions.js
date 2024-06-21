const SecurityIssueDescriptions = {
  "High entropy":
    "High entropy strings typically indicate complex, seemingly random strings often found in security-sensitive contexts, like encryption keys or tokens. In source code, these can be a sign of embedded sensitive information. High entropy is a measure of randomness and unpredictability, and while high entropy is good for security keys, finding such strings hardcoded in the code can suggest a security risk, like exposed secrets.",
  "Insecure import":
    "Insecure imports refer to the inclusion of external libraries or modules in the codebase that are either outdated or have known security vulnerabilities. Relying on insecure imports can expose the application to various security threats, as attackers can exploit known vulnerabilities in these libraries.",
  "Potential hardcoded":
    "This typically refers to embedding sensitive information directly within the source code, such as passwords, API keys, or cryptographic keys. Hardcoding such sensitive data makes the application vulnerable to security breaches if the code is exposed or accessible.",
  "Weak cryptographic":
    "This indicates the use of outdated or proven-to-be-weak cryptographic algorithms for encryption, hashing, or signing. Such weak algorithms are more susceptible to being broken or bypassed by malicious actors, compromising the security of the data they are supposed to protect.",
  "Potential insecure":
    "This refers to the possible use of cryptographic algorithms that are not necessarily known to be weak but are potentially insecure due to improper implementation, configuration, or emerging vulnerabilities. It's a caution against complacency in cryptographic practices.",
  "Potential race":
    "A race condition occurs when the behavior of software is dependent on the sequence or timing of other uncontrollable events. It becomes a concern when different processes access and manipulate the same data concurrently, leading to unpredictable and erroneous behavior, often causing security vulnerabilities.",
  "Potential SQL":
    "This is about the possible presence of code vulnerabilities that could allow SQL injection attacks. These occur when an attacker can insert or manipulate SQL queries in the input fields, potentially giving them unauthorized access to or control over the database.",
  "Potential XSS":
    "XSS (Cross-Site Scripting) vulnerabilities refer to flaws in a web application that allow an attacker to inject malicious scripts into content viewed by other users. Such vulnerabilities can lead to unauthorized access to user data, session hijacking, and other malicious activities.",
};

export default SecurityIssueDescriptions;
