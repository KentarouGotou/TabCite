import React, { useRef, useEffect } from "react";

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    <dev>
      This is a sample React component.
    </dev>
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ background: "#fff", width: "500px", height: "150px" }}
    >
      {/* ここに何か表示したい内容を書く */}
      Hello, React!
    </div>
  );
};

export default App;
