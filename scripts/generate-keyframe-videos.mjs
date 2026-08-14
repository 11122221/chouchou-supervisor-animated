import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const framesDir = resolve(repoRoot, "assets/raw-chouchou-v2");
const introOutput = resolve(repoRoot, "assets/kitty.mp4");
const loopOutput = resolve(repoRoot, "assets/kitty-loop.mp4");
const tempDir = mkdtempSync(join(tmpdir(), "chouchou-keyframes-"));

if (!ffmpegPath || !ffprobeStatic?.path) {
  throw new Error("Project-local FFmpeg or FFprobe is unavailable");
}

try {
  generateIntro();
  generateLoop();
} finally {
  rmSync(tempDir, { force: true, recursive: true });
}

function generateIntro() {
  const introDir = join(tempDir, "intro");
  mkdirSync(introDir, { recursive: true });
  const sequence = [
    "001.png",
    "001.png",
    "001.png",
    "002.png",
    "003.png",
    "004.png",
    "005.png",
    "006.png",
    "007.png",
    "008.png",
    "009.png",
    "010.png",
    "011.png",
    "012.png",
    "012.png",
    "012.png",
  ];
  copySequence(sequence, introDir);

  run([
    "-hide_banner",
    "-y",
    "-framerate",
    "30",
    "-start_number",
    "1",
    "-i",
    join(introDir, "%03d.png"),
    "-vf",
    "scale=1672:940,setpts=30*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,format=yuv420p",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "18",
    "-movflags",
    "+faststart",
    introOutput,
  ]);
  verifyDuration(introOutput, 8);
  logOutput(introOutput);
}

function generateLoop() {
  const loopDir = join(tempDir, "loop");
  mkdirSync(loopDir, { recursive: true });
  const sequence = [
    "011.png",
    "012.png",
    "011.png",
    "012.png",
    "011.png",
  ];
  copySequence(sequence, loopDir);

  run([
    "-hide_banner",
    "-y",
    "-framerate",
    "30",
    "-start_number",
    "1",
    "-i",
    join(loopDir, "%03d.png"),
    "-vf",
    "scale=1672:940,setpts=20*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1,format=yuv420p",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "18",
    "-movflags",
    "+faststart",
    loopOutput,
  ]);
  verifyDuration(loopOutput, 2.5);
  logOutput(loopOutput);
}

function copySequence(sequence, destination) {
  sequence.forEach((name, index) => {
    copyFileSync(
      join(framesDir, name),
      join(destination, `${String(index + 1).padStart(3, "0")}.png`),
    );
  });
}

function verifyDuration(file, minimumSeconds) {
  const result = spawnSync(
    ffprobeStatic.path,
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      file,
    ],
    { encoding: "utf8" },
  );
  const duration = Number(result.stdout.trim());
  if (result.error || result.status !== 0 || !Number.isFinite(duration) || duration < minimumSeconds) {
    throw new Error(`Generated video is too short: ${relative(repoRoot, file)} (${duration || 0}s)`);
  }
}

function run(args) {
  const result = spawnSync(ffmpegPath, args, { stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`ffmpeg exited with status ${result.status}`);
}

function logOutput(file) {
  console.log(`[keyframes] wrote ${relative(repoRoot, file)} (${(statSync(file).size / 1024 / 1024).toFixed(1)} MB)`);
}
