import React, { useRef } from "react";

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (containerRef.current) {
      if (containerRef.current.style.background != "#aaf") {
        containerRef.current.style.background = "#aaf"; // 背景色を水色に変更
      }
      else {
        containerRef.current.style.background = "#fff"; // 背景色を白に戻す
      }
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ background: "#fff", width: "500px", height: "150px" }}
    >
      <div>
        This is a sample React component.
      </div>
      Hello, React!
      <button onClick={handleClick}>背景色を変える</button>
    </div>
  );
};

export default App;
