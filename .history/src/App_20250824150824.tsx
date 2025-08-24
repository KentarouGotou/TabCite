import React, { useRef, useEffect } from "react";

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{ background: "#fff", width: "500px", height: "150px" }}
    >
      {
        <div>
          This is a sample React component.
        </div>
      }
      Hello, React!
    </div>
  );
};

export default App;
