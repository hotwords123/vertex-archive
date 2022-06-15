
import pathlib from "path";
import fs from "fs-extra";
import fetch from "node-fetch";
import { APIResponse, Puzzle } from "./interface";

async function crawl() {
  const resp = await fetch("https://www.nytimes.com/puzzles/vertex");
  const html = await resp.text();

  const before = '<script type="text/javascript">window.gameData = ';
  const after = '</script>';

  let begin = html.indexOf(before);
  if (begin === -1)
    throw new Error("failed to locate gameData begin");

  let end = html.indexOf(after, begin + before.length);
  if (end === -1)
    throw new Error("failed to locate gameData end");

  let str = html.slice(begin + before.length, end);
  let result = JSON.parse(str);
  return result.api as APIResponse;
}

async function main() {
  let data = await crawl();
  let puzzle: Puzzle = {
    id: data.id,
    displayDate: data.displayDate,
    theme: data.theme,
    palette: data.palette,
    shapes: data.shapes,
    vertices: data.vertices
  };

  let outDir = pathlib.resolve(__dirname, "..", "puzzles");
  let filename = `daily-${puzzle.id}.json`;
  let path = pathlib.join(outDir, filename);

  if (fs.existsSync(path)) {
    console.log("File exists, skipping.");
    return;
    let backupFile = `daily-${puzzle.id}-backup${Date.now()}.json`;
    let backupPath = pathlib.join(outDir, backupFile);
    await fs.move(path, backupPath);
    console.log(`Backup: ${filename} => ${backupFile}`);
  }

  await fs.writeJson(path, puzzle);
  console.log(`Written: ${filename}`);
}

main();
