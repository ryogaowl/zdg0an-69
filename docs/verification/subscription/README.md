# 定期ウィジェット装飾（2026-10-30 JST）

対象: `zdg0an-69.myshopify.com` / 下書きテーマ `200718221472` (`zdg0an-69/online-store`, UNPUBLISHED)。作業ルート: `/Users/roomsadbeats/Documents/GitHub/zdg0an-69`。ブランチ `online-store`、開始HEAD `afed078`。

着手前・反映後とも[商品プレビュー](https://ichido.co/products/gensensui-water?preview_theme_id=200718221472&view=gensen)とDraft表示を確認。

## ファイルと反映

- `assets/gensen-main-product.css`: Huckleberry v2ウィジェットを黒背景、#222カード、白文字、オレンジの選択枠・ラジオに変更。hover transition 0.22秒、SP余白、キーボード操作可能な非表示ラジオを追加。
- `before-20261030.json`: リモートCSS・テンプレートの原本とMD5。
- `after-20261030.json`: 反映後のテーマrole・MD5。
- `desktop-1440.png`, `mobile-375.png`: 下書きテーマ実表示。
- 本書: 検証・復旧・共有文面。既存の `../gensen/README.md` に今回の記録への案内を追加。

アプリ生成クラス名には依存せず、ルート・バージョン属性・入力名・ラベル構造に限定。アプリCSSの三重クラス指定に勝つ詳細度を指定。将来アプリDOM構造が変わった場合は再確認が必要。

Shopify側のユーザー編集 `2380a10` をrebaseで保持。商品テンプレートと設定JSONはユーザー変更であり、今回の実装変更ではない。実装コミット `859f838`, `27d4a69` をpushし下書きテーマへ反映済み。本番公開なし。

反映直前にUNPUBLISHEDと原本CSSの一致を確認。最終CSSはローカル・リモートMD5一致（after JSON参照）。テンプレートMD5 `b5c0a9c4548f6843e0bbcd1c336dee5c` は維持。商品・在庫・アプリ設定・販売プランの変更なし。

## 確認結果

| 項目 | 実測・判定 |
| --- | --- |
| 静的確認 | Theme Check エラー0・既存警告15、git diff --check正常。CSSのみのためLiquid生成コードの検証は対象外。 |
| Chrome PC 1440×1000 | 確認済み。黒外枠・暗色カード・オレンジ選択。scrollWidth=1440。 |
| Chrome SP 375×850 | 確認済み。説明文折り返し・価格表示、カード幅293px、scrollWidth=375。物理端末未検証。 |
| プラン選択 | 確認済み。1→2ヶ月をクリック、矢印キーで3ヶ月へ移動、SPで1ヶ月に戻し、checked状態を観測。 |
| 動き | 背景・枠色transition 0.22秒をcomputed styleで確認。既存reduced-motion指定の対象。 |
| 価格 | 各プラン実データ¥5,000表示。価格差のあるプランは存在せず未検証。 |
| 購入フォーム | selling_plan入力は存在。hidden値はブラウザ読み取りでマスクされ、選択値との一致は検証不能。単純比較のfalseを不具合の根拠にしない。 |
| カート投入・決済 | 未検証。在庫0で売り切れのため実行せず。アプリJS・フォームは変更なし。 |
| 実行時エラー | 取得可能なChrome errorログ0件。 |
| 異常系 | アプリ通信失敗の強制再現は対象外（表示CSSのみ）。 |

初回実装では説明文の改行を保持していたが、以下の追加対応で表示上の空行と折り返しを調整。

## 戻し方

後続変更を照合し、今回追加したSubscription widget v2ブロックのみ除去するか、競合がない場合はbefore JSON内のCSS原本を復元。同じ下書きテーマへ反映しMD5と表示を確認。テンプレート・アプリ設定は復元対象外。資料・画像は表示に影響しない。復旧手順の実行は未検証。

## 先方共有文面

定期購入ウィジェットを商品ページ共通の黒・オレンジの配色に調整しました。PC・スマホ幅の表示と、1〜3ヶ月プランの選択を確認済みです。下書きテーマへ反映済みで、本番公開はしていません。在庫がないため購入手続きは未検証です。下記プレビューで配色・余白・選択状態をご確認ください。

https://ichido.co/products/gensensui-water?preview_theme_id=200718221472&view=gensen

## 追加対応: 説明文の改行のみ調整（2026-10-30 01:08 JST）

- 実装: `assets/gensen-main-product.css` の説明文に `white-space: normal; text-wrap: balance;` を追加。文言・文字サイズ・価格・フォームは変更なし。アプリデータ内の末尾空行は変更せず、表示上だけ除去。
- 原本: `wrap-before-20261030.json`。反映前のUNPUBLISHEDとCSS MD5一致を確認。実装コミット `5675ed6` を承認済みブランチへpush。
- Chromeの同一商品プレビューで反映後のcomputed style normal / balanceを確認。PC1440px・SP375pxとも「1ヶ月に一回、定期便で」「商品をお届けします。」の2行となり、末尾「す。」だけの改行を解消。SPカード高さ3件とも100.77px、横はみ出しなし、取得可能なerrorログ0件。
- 証跡: `wrap-desktop-1440.png`, `wrap-mobile-375.png`。検証後viewport復元。本番公開なし。CSS2プロパティのみのためTheme Checkの再実行は省略、git diff --check正常。購入・決済は今回対象外。
- 復旧: 後続差分を照合し、追加した上記2プロパティのみ除去して同じ下書きへ反映。原本はwrap-before JSON参照。復旧操作自体は未実行。
- 先方共有文面: 定期プラン説明文の改行を整え、末尾だけの折り返しと余分な空行を解消しました。下書きへ反映済み・本番未公開です。[商品プレビュー](https://ichido.co/products/gensensui-water?preview_theme_id=200718221472&view=gensen)でPC・スマホの説明文をご確認ください。
