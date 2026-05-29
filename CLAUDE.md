# CLAUDE.md

Claude Code がこのリポジトリで作業するための指針。

## プロジェクト概要

街で見つけたものでビンゴをする幼児向けの「おさんぽビンゴ」。散歩中に親子で遊ぶ。
対象は字が読めない幼児なので、**絵が主役・文字は補助**。元ネタは紙のビンゴカード／「道ミッケ」遊び。

## 技術スタック

- Vite + React 19 + TypeScript（strict）
- PWA: `vite-plugin-pwa`（オフライン動作）
- アイコン操作のみ `lucide-react`。重い依存は足さない
- パッケージマネージャは **pnpm**。Node/pnpm のバージョンは `mise.toml` で固定

### ツールチェーン方針（新世代ツールへ寄せ済み）

- **型チェックは tsgo**（`@typescript/native-preview`）。emit は Vite(esbuild) が担当し、tsgo は `--noEmit` の型検査専用。emit/宣言出力には使わない。
- **整形は oxfmt**（Prettier互換・置換済み）。設定は `.oxfmtrc.json`。
- **静的解析は oxlint**（`.oxlintrc.json`）。
- tsgo は TypeScript 7 プレビュー、oxfmt はベータ。`typescript` パッケージは**エディタ補完とフォールバックのため残してある**（消さない）。挙動が怪しいときは `tsc --noEmit` で突き合わせる。
- これらはプレビュー/ベータなのでバージョンは `pnpm-lock.yaml` で固定。アップグレードは差分を確認してから。

## セットアップ / コマンド

```bash
mise install        # node, pnpm を導入
mise run setup      # = pnpm install
mise run dev        # 開発サーバ
mise run typecheck  # tsgo --noEmit（型チェックのみ）
mise run build      # tsgo型チェック + Viteビルド(dist/)
mise run preview    # 実機確認（--host でLAN公開）
mise run lint       # oxlint
mise run format     # oxfmt（その場整形）
```

## ディレクトリと役割

- `src/catalog.ts` … お題データ（**id が主キー**）と配色
- `src/bingo.ts` … ライン生成・勝利判定・中央index（純関数。テスト対象）
- `src/random.ts` … シャッフル（純関数）
- `src/storage.ts` … 永続化（localStorage）。写真API(v1.x)の差込み位置をコメント済み
- `src/speech.ts` … 読み上げ（Web Speech API）
- `src/App.tsx` … 状態管理・永続化・オーケストレーション
- `src/components/` … Tile / WinOverlay / SettingsSheet（表示のみ、状態は持たない）
- `src/index.css` … 全スタイル（手書き風フォント・クレヨン調マーカー）
- `docs/ROADMAP.md` … 今後の実装計画（ヒント程度。詳細は着手時に再考）

## 設計上の不変条件（壊さないこと）

1. **写真は端末ローカル(IndexedDB)のみ。サーバへ送らない。** 公開してもプライバシー責任を負わないための前提。
2. お題は `id` で同定する。emoji は表示層にすぎず、v2 で手描きSVGに差し替えても id を変えない。
3. 永続化は必ず `src/storage.ts` 経由。コンポーネントから直接 localStorage を触らない。
4. アカウント・サーバ機能は v3 まで導入しない（導入時は要相談）。
5. UI 文言は日本語・ひらがな主体（読み手は幼児）。

## コーディング規約

- TypeScript strict を維持。`any` を増やさない
- ロジック（判定・乱数）は純関数として `src/` 直下に置き、テスト可能に保つ
- 整形は oxfmt、静的解析は oxlint、型チェックは tsgo。コミット前に `mise run lint` `mise run typecheck` `mise run format:check` が通ること
- コンポーネントは表示に専念し、状態は `App.tsx` に集約

## やってほしい進め方

- 制約・前提を確認 → 最小実装 → 動作確認、の順。大きな依存追加や方針変更は先に提案する
- 新機能は `docs/ROADMAP.md` のフェーズに沿って。ロードマップ自体の更新も歓迎
