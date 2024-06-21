import React, { useState } from "react";
import "./Accordion.css";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion">
      <div className="accordion-title" onClick={() => setIsOpen(!isOpen)}>
        {title}
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

export default Accordion;
