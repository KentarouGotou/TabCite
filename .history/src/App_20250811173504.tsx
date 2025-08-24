import React, { useEffect, useMemo, useRef, useState } from "react";
import { Renderer, TabNote, TabStave, Voice, Formatter } from "vexflow";

/**
 * Very small, learnable input format:
 * - Comma-separated quarter notes
 * - Each note is one or more "string:fret" pairs separated by "+"
 * - string: 1 = high E, 6 = low E (guitar standard)
 *
 * Examples:
 *   "3:2,3:4,2:2,1:0"
 *   "4:5+3:5+2:5, 4:7+3:7+2:7"  (stacked notes = chord)
 */
function parseUserInput(input: string) {
  // Trim and split by comma => notes
  const tokens = input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // Map to VexFlow TabNote definitions
  const notes = tokens.map((token) => {
    const positions = token.split("+").map((pair) => {
      const [s, f] = pair.split(":").map((x) => x.trim());
      const str = Number(s);
      const fret = String(f ?? "");
      if (!Number.isFinite(str) || fret === "") {
        throw new Error(`Invalid token: "${pair}"`);
      }
      return { str, fret };
    });

    const n = new TabNote({
      positions,
      duration: "q" // quarter notes for simplicity
    });

    n.setStyle({ fillStyle: "#fff"});
    return n;
  });

  return notes;
}

const DEFAULT_INPUT = "4:5,4:7,3:7,2:5"; // basic 4 quarter notes

export default function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [userText, setUserText] = useState<string>(() => {
    // Restore last text from localStorage if exists
    const saved = localStorage.getItem("tab_input_v1");
    return saved ?? DEFAULT_INPUT;
  });

  // Cache parsed notes or show a friendly error
  const { notes, error } = useMemo(() => {
    try {
      const parsed = parseUserInput(userText);
      return { notes: parsed, error: null as string | null };
    } catch (e: any) {
      return { notes: [] as TabNote[], error: e?.message ?? String(e) };
    }
  }, [userText]);

  useEffect(() => {
    localStorage.setItem("tab_input_v1", userText);
  }, [userText]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous SVG
    containerRef.current.innerHTML = "";

    // Create renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    const w = 780;
    const h = 180;
    renderer.resize(w, h);
    const context = renderer.getContext();

    // Create a TabStave (TAB staff)
    const tabStave = new TabStave(10, 30, w - 20);
    tabStave.addClef("tab");
    tabStave.setContext(context).draw();

    // If no valid notes yet, stop here
    if (!notes.length) return;

    // Create voice (4/4, and we assume quarter notes)
    const voice = new Voice({ num_beats: notes.length, beat_value: 4 });
    voice.addTickables(notes);

    // Format and draw
    new Formatter().joinVoices([voice]).format([voice], w - 60);
    voice.draw(context, tabStave);
  }, [notes]);

  return (
    <div className="card">
      <h1>Simple Tablature Editor (VexFlow + React + TS)</h1>

      <div className="row" style={{ marginBottom: 8 }}>
        <input
          style={{ minWidth: 420 }}
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder='e.g. 4:5,4:7,3:7,2:5 or chords like 4:5+3:5+2:5'
        />
        <button
          onClick={() => setUserText(DEFAULT_INPUT)}
          title="Reset to sample"
        >
          Reset
        </button>
      </div>
      <div className="hint">
        入力ルール: カンマ区切りで音符を列挙。各音符は <code>string:fret</code> を
        <code>+</code> で積み重ねると和音（例:
        <code>4:5+3:5+2:5</code>）になります。stringは1=一番細い弦（1st/high E）〜6=一番太い弦（6th/low E）。
        今は全部4分音符として描画します。
      </div>

      {error && (
        <div className="hint" style={{ color: "#fca5a5", marginTop: 4 }}>
          Parse error: {error}
        </div>
      )}

      <div id="vf" ref={containerRef} style={{ marginTop: 12 }} />
    </div>
  );
}
