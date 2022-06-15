
// Puzzles from https://www.nytimes.com/puzzles/vertex

export interface Puzzle {
  id: string;
  displayDate: string;
  theme: string;
  palette: string[];
  shapes: PuzzleShape[];
  vertices: Record<string, PuzzleVertex>;
}

export interface PuzzleShape {
  vertices: number[];
  color: number;
  isPreDrawn?: boolean;
}

export interface PuzzleVertex {
  coordinates: [number, number];
  shapes: string[];
}

export interface APIResponse extends Puzzle {
  puzzleConstructor: string;
  starterPuzzles: Puzzle[];
  tutorial: Puzzle[];
}
