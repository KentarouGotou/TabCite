import React, { useEffect, useRef } from 'react';
import Vex from 'vexflow';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Factory APIで五線譜を描画
    const vf = new Vex.Flow.Factory({
      renderer: { element: containerRef.current, width: 400, height: 150 }
    });
    const score = vf.EasyScore();
    const system = vf.System();

    system.addStave({
      voices: [
        score.voice(score.notes('C4/q, D4, E4, F4', { stem: 'up' }))
      ]
    }).addClef('treble').addTimeSignature('4/4');

    vf.draw();
  }, []);

  return (
    <div>
      <h1>VexFlow Factory APIで五線譜</h1>
      <div ref={containerRef}></div>
    </div>
  );
}

export default App;

