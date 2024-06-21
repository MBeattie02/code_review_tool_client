import React from "react";
import "./RawCodeModal.css";

const RawCodeModal = ({ code, onClose, issueLines = [] }) => {
  // Split code into lines
  const codeLines = code.split("\n");

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">
          X
        </button>
        <pre>
          {codeLines.map((line, index) => (
            <div
              key={index}
              className={`code-line ${
                issueLines.includes(index + 1) ? "highlight-line" : ""
              }`}
            >
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};

export default RawCodeModal;
