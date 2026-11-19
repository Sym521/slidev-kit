# デザインの微調整ガイド（人間向け）

## どこを触ればいいか

ほぼすべての見た目は **`themes/basic/styles/tokens.css`** の数値で決まっています。
キャンバスは 1920×1080 なので、Figma の数値（px）をそのまま書けば同じ位置・大きさになります。

| やりたいこと | 変えるトークン |
|---|---|
| 強調色を変える | `--c-accent` |
| 文字サイズ・行間 | `--fs-*`, `--lh-*`, `--ls-*`（Figma のテキストスタイル名をコメントに記載） |
| 左右の余白 | `--margin-x` |
| 箇条書きの間隔 | `--gap-list` |
| 本文の開始位置（image-right） | `--content-top` |
| default の本文の縦位置 | `--default-body-bottom`（増やすと上に寄る） |
| 画像の角丸 | `--radius-media`, `--radius-figure` |
| image-right の文章幅・画像位置 | `--ir-*`（`wide: true` 用は `--ir-wide-*`） |
| まとめ／参考文献の間隔 | `--st-gap-*` |

構造（どこに何を置くか）を変えたいときは `themes/basic/layouts/*.vue`、全体共通の文字・箇条書き・強調は `themes/basic/styles/base.css` です。

## 確認方法

1. slidev-kit リポジトリで `pnpm preview basic` を実行し、ブラウザで http://localhost:3030 を開く（全レイアウトの見本）
2. `tokens.css` を保存すると即座に反映されます
3. Figma と並べて確認したいときは `pnpm compare basic` を実行し、`exports/compare/basic/` の画像を見る
   （上から Figma / Slidev / 重ね合わせ。赤 = Slidev だけ、水色 = Figma だけ）

文字数の上限を変えたいときは `themes/basic/limits.mjs`（チェックの基準）と `themes/basic/docs/layouts.md`（Claude 向けの説明）の両方を更新してください。

## 新しいレイアウトが欲しくなったら

slidev-kit リポジトリで Claude に「○○なレイアウトを追加したい」と依頼してください。
追加したら `themes/basic/limits.mjs`（上限）と `themes/basic/docs/layouts.md`（説明）の両方を更新します。
各発表リポジトリには push 後に `pnpm update` で反映されます。
