import React, { useState, useEffect, useRef } from "react";
import { Factory } from "vexflow";

const App = () => {
  const [count, setCount] = useState(0); // 状態を保存
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    inputRef.current?.focus(); // input要素に直接アクセス
  };

  useEffect(() => {
    console.log("コンポーネントが表示された！");
    // ここに副作用を書く
  }, []); // []は「初回だけ実行」の意味

  useEffect(() => {
    if (containerRef.current) {
      // 既存の内容をクリア
      containerRef.current.innerHTML = "";
      // VexFlowで楽譜を描画
      const vf = new Factory({ renderer: { elementId: containerRef.current, width: 500, height: 200 } });
      const score = vf.EasyScore();
      const system = vf.System();
      system.addStave({
        voices: [score.voice(score.notes("C4/q, D4, E4, F4"))]
      }).addClef("treble").addTimeSignature("4/4");
      vf.draw();
    }
  }, []);

  return (
    <div>
      <h1>Music Score</h1>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>増やす</button>
      <div>
        <input ref={inputRef} type="text" />
        <button onClick={handleClick}>フォーカス</button>
      </div>
      <div>Hello!</div>
      <h1>VexFlow 楽譜表示サンプル</h1>
      <div ref={containerRef}></div>
    </div>
  );
};

const Timer = () => {
  const [seconds, setSeconds] = useState(0); // 表示用
  const timerIdRef = useRef<NodeJS.Timeout | null>(null); // setIntervalのID
  const startTimeRef = useRef<number | null>(null); // 開始時刻

  const handleStart = () => {
    if (timerIdRef.current) return; // すでに動いていれば何もしない
    startTimeRef.current = Date.now();
    timerIdRef.current = setInterval(() => {
      if (startTimeRef.current !== null) {
        setSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 100);
  };

  const handleStop = () => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  };

  return (
    <div>
      <p>経過秒数: {seconds}</p>
      <button onClick={handleStart}>開始</button>
      <button onClick={handleStop}>終了</button>
    </div>
  );
};

export default App;
export { Timer };
