# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

**プロジェクト名:** quiz-app  
**種別:** 一般常識クイズアプリ  
**技術スタック:** HTML / CSS / JavaScript（バニラ）

ビルドツール・フレームワーク・パッケージマネージャーは一切使用しない。`index.html` をブラウザで直接開けば動作する。

## ファイル構成

- `index.html` — シングルページのマークアップ。`.hidden` クラスのトグルで `#quiz-screen` と `#result-screen` の2画面を切り替える
- `style.css` — 全スタイル。`correct` / `incorrect` / `hidden` クラスのトグルで状態に応じた見た目を制御
- `script.js` — 全ロジック。問題データ・DOM操作・スコア管理を担う

## アーキテクチャ

状態は3つのモジュールレベル変数で管理する: `currentIndex`、`score`、`answered`。

処理フロー:

1. `loadQuestion()` — 現在の問題を描画し、問題ごとの状態をリセット
2. `selectAnswer()` — 全ボタンを無効化し、正解/不正解クラスを付与、フィードバックを表示、次へボタンを表示
3. 次へボタン押下 — `loadQuestion()` を再度呼ぶか、最終問題なら `showResult()` を呼ぶ
4. リトライ — `currentIndex` と `score` をリセットし、`loadQuestion()` を呼ぶ

## 問題データ

問題は `script.js` 冒頭の `questions` 配列で定義する。各エントリの形式:

```js
{ text, choices: [string×4], correct: index, explanation }
```

- `text` — 問題文
- `choices` — 4択の選択肢（文字列配列）
- `correct` — 正解の選択肢インデックス（0始まり）
- `explanation` — 解説文

## 開発上の注意

- フレームワーク・ライブラリは導入しない（バニラJS維持）
- 問題を追加・編集する場合は `questions` 配列のみ変更する
- スタイル変更は `style.css` で行い、インラインスタイルは使わない
