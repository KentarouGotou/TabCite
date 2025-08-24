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
  
}
