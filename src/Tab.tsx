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

const Tab = () => {
    
}