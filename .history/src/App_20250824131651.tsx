import React, { useEffect, useRef } from "react";
import { Renderer, Stave } from "vexflow";

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // SVGレンダラーを作成
      const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
      renderer.resize(500, 150);
      const context = renderer.getContext();

      // 五線譜を作成
      const stave = new Stave(10, 40, 400);
      stave.addClef("treble").addTimeSignature("4/4");
      stave.setContext(context).draw();
    }
  }, []);

  return <div ref={containerRef}></div>;
};

export default App;
