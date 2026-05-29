# おさんぽビンゴ

[![CI](https://github.com/hazymoon/osanpo-bingo/actions/workflows/ci.yml/badge.svg)](https://github.com/hazymoon/osanpo-bingo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

街で見つけものをする、幼児向けの「おさんぽビンゴ」。散歩中に親子で遊ぶPWAです。
バス停・黄色い車・犬・マンホール…といったお題をタップで消していき、縦横斜めが揃うとビンゴ。
字が読めない子でも遊べるよう、絵が主役・タップで名前を読み上げます。

- バックエンドレス（静的配信のみ）
- オフライン動作（PWA）
- 写真機能は端末ローカルのみで完結予定（サーバに送らない方針）

## 必要環境

- [mise](https://mise.jdx.dev/)（Node 22 / pnpm 11 を固定管理）
- モダンブラウザ。PWAインストール・カメラ(将来)は HTTPS または localhost が前提
- 読み上げは Web Speech API（ja-JP 音声の有無は OS 依存）

## セットアップ

```bash
mise install      # node, pnpm を導入
mise run setup    # 依存インストール
mise run dev      # http://localhost:5173
```

実機（スマホ）で確認するとき:

```bash
mise run build
mise run preview  # --host でLANに公開。表示されたURLにスマホでアクセス
```

## コマンド

| コマンド             | 内容                                   |
| -------------------- | -------------------------------------- |
| `mise run dev`       | 開発サーバ                             |
| `mise run typecheck` | tsgo で型チェックのみ                  |
| `mise run build`     | tsgo型チェック + Viteビルド（`dist/`） |
| `mise run preview`   | ビルド結果を実機確認                   |
| `mise run lint`      | oxlint                                 |
| `mise run format`    | oxfmt（その場整形）                    |

型チェックは tsgo（TypeScript 7 プレビュー）、整形は oxfmt、静的解析は oxlint。emit は Vite が担当するため tsgo は型検査専用。`typescript` はエディタ補完とフォールバック用に残してある。

## デプロイ

`mise run build` で生成される `dist/` を静的ホスティングに置くだけ（GitLab Pages / Cloudflare Pages など）。バックエンドは不要。

## プライバシー方針

写真機能（今後追加予定）は撮影画像を端末内（IndexedDB）にのみ保存し、サーバへ送信しません。

## 開発の進め方

`CLAUDE.md`（設計上の不変条件・規約）と `docs/ROADMAP.md`（今後の計画）を参照。

## ライセンス

[MIT License](LICENSE)。
