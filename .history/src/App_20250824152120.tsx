import React, { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote } from 'vexflow';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // SVGレンダラーを作成
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(400, 150);
    const context = renderer.getContext();

    // 五線譜を作成
    const stave = new Stave(10, 40, 300);
    stave.addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();

    // 音符を作成
    const notes = [
      new StaveNote({ keys: ['c/4'], duration: 'q' }),
      new StaveNote({ keys: ['d/4'], duration: 'q' }),
      new StaveNote({ keys: ['e/4'], duration: 'q' }),
      new StaveNote({ keys: ['f/4'], duration: 'q' }),
    ];

    // 音符を描画
    // Formatterで自動的に配置
    const VF = require('vexflow');
    new VF.Formatter().joinVoices([new VF.Voice({ num_beats: 4, beat_value: 4 }).addTickables(notes)]).format([new VF.Voice({ num_beats: 4, beat_value: 4 }).addTickables(notes)], 300);
    notes.forEach(note => note.setContext(context));
    notes.forEach(note => note.draw());

  }, []);

  return (
    <div>
      <h1>VexFlowで五線譜を描画</h1>
      <div ref={containerRef}></div>
    </div>
  );
}

export default App;

