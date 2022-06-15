
import pathlib from "path";
import fs from "fs-extra";

import { Puzzle, PuzzleVertex } from "./interface";

const srcDir = pathlib.resolve(__dirname, "..", "puzzles");
const outDir = pathlib.resolve(__dirname, "..", "..", "ShapePainter", "drawings");

for (const filename of fs.readdirSync(srcDir)) {
  if (filename.endsWith(".json") && !filename.startsWith("tutorial-")) {
    const inPath = pathlib.join(srcDir, filename);
    const puzzle: Puzzle = fs.readJsonSync(inPath);

    const outPath = pathlib.join(outDir, puzzle.theme.replace(/[\\/:*?"<>|]/g, "") + ".txt");
    if (fs.existsSync(outPath)) continue;
    console.log(`${filename}: id = ${puzzle.id} theme = "${puzzle.theme}" date = "${puzzle.displayDate}"`);

    const lines: string[] = [];

    let vertices: PuzzleVertex[] = [];
    for (const index in puzzle.vertices) {
      vertices[index] = puzzle.vertices[index];
    }

    lines.push(`${vertices.length}`);
    for (const vertex of vertices) {
      let [x, y] = vertex.coordinates;
      lines.push(`${x.toFixed(4)} ${y.toFixed(4)}`);
    }

    lines.push(`${puzzle.palette.length}`);
    for (const color of puzzle.palette) {
      let value = parseInt(color.slice(1), 16);
      let red = value >> 16 & 255;
      let green = value >> 8 & 255;
      let blue = value & 255;
      lines.push(`${red} ${green} ${blue}`);
    }

    lines.push(`${puzzle.shapes.length}`);
    for (const shape of puzzle.shapes) {
      lines.push(`${shape.vertices.join(" ")} ${shape.color}`);
    }

    lines.push('');

    fs.writeFileSync(outPath, lines.join('\n'));
  }
}
