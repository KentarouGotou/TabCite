import React, { useRef, useEffect } from "react";

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ここに副作用を書く（今回は何もしない）
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
