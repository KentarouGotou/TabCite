import React, { useRef, useEffect, useState } from "react";

const fretCount = 5;
const stringCount = 6;
const width = 400;
const height = 200;
const fretSpacing = width / fretCount;
const stringSpacing = height / (stringCount - 1);
// サンプルタブ譜（1次元配列に）
const sampleTab = [
  { positions: [ { string: 1, fret: 2 }, { string: 2, fret: 3 }, { string: 3, fret: 1 } ], duration: 1.2 },
  { positions: [ { string: 4, fret: 2 } ], duration: 0.8 },
  { positions: [ { string: 2, fret: 1 } ], duration: 1.0 },
];

const App = () => {
  // 再生中かどうか
  const [playing, setPlaying] = useState(false);
  // 現在のインデックス
  const [currentIdx, setCurrentIdx] = useState(0);
  // アニメーション進行度（0〜1）
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number | null>(null);

  // 再生ボタン押下時
  const handleStart = () => {
    setPlaying(true);
    setCurrentIdx(0);
    setProgress(0);
  };

  // アニメーションループ
  useEffect(() => {
    if (!playing) return;
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const tab = sampleTab[currentIdx];
      const duration = tab.duration * 1000; // ms
      const elapsed = timestamp - startTime;
      let prog = Math.min(elapsed / duration, 1);
      setProgress(prog);
      if (prog < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        // 次のノートへ
        if (currentIdx < sampleTab.length - 1) {
          setCurrentIdx(idx => idx + 1);
          setProgress(0);
        } else {
          setPlaying(false);
        }
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [playing, currentIdx]);

  // 現在のポジションを取得
  const tab = sampleTab[currentIdx];

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <button onClick={handleStart} disabled={playing} style={{margin:8}}>再生</button>
      <svg width={width} height={height} style={{ background: "#fff" }}>
        {/* フレット線 */}
        {[...Array(fretCount)].map((_, i) => (
          <line
            key={i}
            x1={i * fretSpacing}
            y1={0}
            x2={i * fretSpacing}
            y2={height}
            stroke="#888"
            strokeWidth={i === 0 ? 6 : 2}
          />
        ))}
        {/* 弦 */}
        {[...Array(stringCount)].map((_, i) => (
          <line
            key={i}
            x1={0}
            y1={i * stringSpacing}
            x2={width}
            y2={i * stringSpacing}
            stroke="#444"
            strokeWidth={2}
          />
        ))}
        {/* ポジションマーク */}
        {playing && tab.positions.map((p, idx) => (
          <circle
            key={idx}
            cx={(p.fret + 0.5) * fretSpacing}
            cy={p.string * stringSpacing}
            r={16}
            fill="orange"
          />
        ))}
      </svg>
    </div>
  );
};

export default App;
