import { useEffect, useRef } from "react";
import Vex from "vexflow";

const Score = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const factory = new Vex.Flow.Factory({
      renderer: { elementId: containerRef.current.id, width: 500, height: 200 }
    });
    const score = factory.EasyScore();
    const system = factory.System();

    system.addStave({
      voices: [score.voice(score.notes("C#5/q, B4, A4, G#4"))],
    });

    factory.draw();
  }, []);

  return <div id="score" ref={containerRef} style={{background: "white"}}></div>;
};

export default Score;

