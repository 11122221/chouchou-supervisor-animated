# Chouchou Supervisor Animated / 臭臭监督官动态版

A Windows/macOS desktop break reminder built with Tauri 2, React and TypeScript. Chouchou walks onto a transparent always-on-top overlay, settles down, blinks, and watches the countdown.

The animation is based on the cat photos and videos supplied for this project. It uses transparent PNG keyframes plus CSS motion, avoiding the visible deformation that can occur when unrelated poses are joined with optical-flow video interpolation.

The settings page can allow immediate closing or lock manual close controls for the first 30 seconds. The natural supervisor countdown still completes normally.

## Development

Requirements: Node.js 20+, pnpm 10+, Rust stable, and the platform prerequisites listed in the Tauri documentation.

```bash
pnpm install
pnpm run app:dev
```

Frontend-only checks:

```bash
pnpm run typecheck
pnpm run build
```

Windows installer:

```bash
pnpm run app:build:windows
```

The included `.github/workflows/release-windows.yml` creates a draft GitHub Release and Windows installer whenever a `v*` tag is pushed. No GitHub username or password belongs in this repository.

## Repository layout

- `public/chouchou/`: transparent runtime animation frames
- `assets/raw-chouchou/`: editable green-screen source frames
- `scripts/generate-keyframe-videos.mjs`: optional keyframe-to-video experiment
- `src/`: React interface and animation controller
- `src-tauri/`: native desktop application

Private identity references are kept under `refs/` and are ignored by Git. Temporary QA output under `tmp/` is also ignored.

## Attribution

This project is a customized derivative of [elliothux/kitty-screen](https://github.com/elliothux/kitty-screen). The upstream MIT license is retained in `LICENSE`.
