# 臭臭监督官动态版

这是一个使用 Tauri 2、React 和 TypeScript 开发的桌面休息提醒应用。提醒出现时，臭臭会在透明置顶窗口中走进画面、趴下、眨眼，并陪着倒计时。

动画形象以本项目收到的臭臭照片和视频为准。运行时使用透明 PNG 姿态帧配合连续位移动画，不使用会造成脸部和腿部变形的光流补帧成片。

## 本地开发

需要 Node.js 20+、pnpm 10+、Rust stable，以及 Tauri 官方文档列出的对应系统构建环境。

```bash
pnpm install
pnpm run app:dev
```

只检查前端：

```bash
pnpm run typecheck
pnpm run build
```

构建 Windows 安装包：

```bash
pnpm run app:build:windows
```

仓库自带 `.github/workflows/release-windows.yml`。上传到 GitHub 后推送 `v*` 标签，Actions 会生成一个草稿 Release 和 Windows 安装包；不需要把 GitHub 账号密码写进项目。

## 目录说明

- `public/chouchou/`：应用实际加载的透明动画帧
- `assets/raw-chouchou/`：可继续编辑的绿幕源帧
- `scripts/generate-keyframe-videos.mjs`：可选的关键帧转视频实验脚本
- `src/`：React 界面和动画控制逻辑
- `src-tauri/`：桌面端原生逻辑

猫咪身份参考资料放在 `refs/` 下，临时质检文件放在 `tmp/` 下，这两个目录都不会上传到 Git。

## 开源归属

本项目基于 [elliothux/kitty-screen](https://github.com/elliothux/kitty-screen) 定制开发，保留上游项目的 MIT `LICENSE`。
