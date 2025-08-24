// ScoreEditor.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import Vex from "vexflow";

// --- Types: very small shape for demo ---
type Pitch = { step: "a"|"b"|"c"|"d"|"e"|"f"|"g"; octave: number; acc?: "#"|"b" };
type Note = { keys: string[]; duration: "w"|"h"|"q"|"8"|"16"; acc?: "#"|"b" };
type Measure = { voices: Note[][] }; // voices[0] だけ使う簡易版
type Score = { measures: Measure[] };

const VF = Vex.Flow;

export default function ScoreEditor() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState<{measureIdx: number; noteIdx: number|null}>({ measureIdx: 0, noteIdx: null });
  const [score, setScore] = useState<Score>({
    measures: [{ voices: [[]] }], // 1小節・1声の空譜面
  });

  // ---- helpers ----
  const toKey = (p: Pitch) => `${p.step}${p.acc ?? ""}/${p.octave}`;
  const clamp = (x:number, lo:number, hi:number)=>Math.max(lo, Math.min(hi, x));

  // y座標→五線の音高にラフ変換（ト音記号、C4=中央ド基準）
  const yToPitch = (y: number, staveY: number, lineSpace: number): Pitch => {
    // 五線の中央あたりを C4 として段差±で上下する簡易マッピング
    const delta = Math.round((staveY + 4*lineSpace - y) / (lineSpace/2)); // 半線刻み
    // 半線2つで全音程1上げ
    const steps: Pitch["step"][] = ["c","d","e","f","g","a","b"];
    // 中央C4を起点
    let idx = 0; // c
    let octave = 4;
    let semis = delta; // 半線=半音とみなす簡易
    // 半音を度数へざっくりマップ（デモ用なので正確さより簡易性）
    // ここは実際には鍵盤配列や譜表線位置から厳密に作るのが吉
    while (semis > 1) { idx++; semis -= 2; if (idx>=steps.length){ idx=0; octave++; } }
    while (semis < -1){ idx--; semis += 2; if (idx<0){ idx=steps.length-1; octave--; } }
    return { step: steps[idx]!, octave: clamp(octave,2,6) };
  };

  // x座標→小節/拍（今回は 1小節固定で末尾に挿入）
  const insertAtCursor = (p: Pitch) => {
    setScore(prev => {
      const measures = [...prev.measures];
      const m = measures[cursor.measureIdx] ?? { voices:[[]] };
      const voice0 = [...(m.voices[0] ?? [])];
      const note: Note = { keys: [toKey(p)], duration: "q" };
      if (cursor.noteIdx === null) {
        voice0.push(note);
      } else {
        voice0.splice(cursor.noteIdx + 1, 0, note);
      }
      measures[cursor.measureIdx] = { voices: [voice0] };
      return { measures };
    });
    setCursor(c => ({ ...c, noteIdx: (c.noteIdx ?? -1) + 1 }));
  };

  // キー入力（A~G, +/-, Backspace）
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["a","b","c","d","e","f","g","+","-","Backspace"].includes(e.key)) return;
    e.preventDefault();
    setScore(prev => {
      const measures = [...prev.measures];
      const m = measures[cursor.measureIdx] ?? { voices:[[]] };
      const voice0 = [...(m.voices[0] ?? [])];
      if (e.key === "Backspace") {
        if (cursor.noteIdx != null && voice0[cursor.noteIdx]) {
          voice0.splice(cursor.noteIdx, 1);
          measures[cursor.measureIdx] = { voices:[voice0] };
          // カーソルを一つ戻す
          setCursor(c => ({ ...c, noteIdx: (c.noteIdx! - 1 >= 0 ? c.noteIdx! - 1 : null) }));
        }
        return { measures };
      }
      // 既存ノートを編集（なければ何もしない）
      if (cursor.noteIdx != null && voice0[cursor.noteIdx]) {
        const n = { ...voice0[cursor.noteIdx] };
        let [ks, oct] = n.keys[0].split("/");
        let step = ks[0]!.toLowerCase();
        let acc = ks.length > 1 ? ks.slice(1) : "";
        if ("abcdefg".includes(e.key)) step = e.key;
        if (e.key === "+") acc = "#";
        if (e.key === "-") acc = "b";
        n.keys = [`${step}${acc}/${oct}`];
        voice0[cursor.noteIdx] = n;
        measures[cursor.measureIdx] = { voices:[voice0] };
      }
      return { measures };
    });
  }, [cursor]);

  // クリックで挿入
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLElement).closest(".vf-container")!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // 簡易：最初の小節の座標系を固定値で仮定（実運用は描画結果から取得してください）
    const staveTop = 20;         // px
    const lineSpace = 10;        // px
    const p = yToPitch(y, staveTop, lineSpace);
    insertAtCursor(p);
  };

  // 描画
  useEffect(() => {
    if (!containerRef.current) return;

    // cleanup DOM
    containerRef.current.innerHTML = "";

    const factory = new VF.Factory({
      renderer: { elementId: containerRef.current, width: 800, height: 180 },
    });
    const scoreAPI = factory.EasyScore();
    const system = factory.System({ x: 10, y: 20, width: 760, spaceBetweenStaves: 10 });

    // 1小節ずつ描画（デモは1小節）
    score.measures.forEach((m) => {
      const notesStr = (m.voices[0] ?? []).map(n => {
        // e.g., "c#/4" 形式に変換済み
        const key = n.keys[0];
        return `${key}/${n.duration}`; // "c#/4/q" の EasyScore 形式を使ってもOK
      });
      const measureNotes = notesStr.length ? notesStr.join(", ") : "b/4/r"; // 休符代用
      system.addStave({
        voices: [scoreAPI.voice(scoreAPI.notes(measureNotes))],
      });
    });

    factory.draw();
  }, [score]);

  return (
    <div
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="vf-container"
      ref={containerRef}
      onClick={onClick}
      style={{ outline: "none", userSelect: "none" }}
    />
  );
}

