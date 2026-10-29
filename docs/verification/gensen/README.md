> 2026-10-30追記: 定期購入ウィジェットを黒・オレンジに調整し下書きへ反映。[検証・変更一覧・共有文面](../subscription/README.md)。プラン選択まで確認、購入は在庫0のため未検証。

# GENSEN 商品ページ 実装・検証記録

## 最終確認（2026-10-27 23:40 JST）

- 実装コミット `6c7fdf8` を `online-store` にプッシュ済み。GitHub連携先の下書きテーマ `200718221472` はUNPUBLISHED。変更したテーマ6ファイルのAPIチェックサムがローカルと一致。本番テーマの公開切替なし。
- [確認済みの商品プレビュー](https://ichido.co/products/gensensui-water?preview_theme_id=200718221472&view=gensen)。実際のShopify商品データを表示。GENSENの通常URLへのテンプレート恒久割当は未実施。
- ChromeのPC 1440px／SP 375pxで確認。ページ背景は `rgb(34,34,34)`、横はみ出しなし。PCギャラリー640px、購入欄の開始位置880px・幅400px。SPギャラリー325px・サムネイル70px。黒キャップが先頭、白キャップへの切替と画像拡大・閉じるが動作。
- 説明5件、特徴ラベル4件、ダミーFAQ5件、Other Productを確認。FAQのクリック開閉・Enter操作と閉じた後の状態復元を確認。表示対象の画像読み込み失敗なし。
- ユーザーによるDAICHIのオンラインストア掲載を確認。APIはUNLISTED、publishedAtあり、seo.hidden=1、在庫0・DENY。関連カードから `/products/daichi-protein?view=gensen` へ遷移し、価格表示0件・カート追加フォーム0件・販売準備中ボタン無効を確認。
- Theme Checkは0エラー・既存15警告、diff whitespaceチェック正常。Toolkit Liquid検証は内部のFileType exportエラーで利用不能。Admin GraphQL操作はToolkitで検証済み。
- ブラウザコンソールのerrorは0件。既存ShopifyカスタムWeb Pixelのsandbox警告あり。実注文・決済は行っていない。単一バリエーション／在庫0のため複数バリエーション購入とMikawayaは未検証。
- FAQ ListはFigmaの装飾を復元済み。共通FAQ URLが未設定のため無効表示。Mikawayaは導入後に標準アプリブロックへ追加する。特徴ラベル・FAQ・説明文の確定は公開前に行う。
- ヘッダー・フッターは既存の共通セクションを利用し、別担当の制作範囲とする。商品画像は実登録2点のため、Figmaの空サムネイルは増設していない。

### 今回追加・修正したファイル（背景・コンテンツ・商品データ調整）

実装・運用コード：

| ファイル | 内容 |
| --- | --- |
| `assets/gensen-main-product.css` | ページ全体#222222、PC/SPの余白・画像・文字・ボタン寸法、hoverとFAQ装飾 |
| `layout/theme.liquid` | GENSEN商品テンプレートのbodyクラス |
| `sections/main-product.liquid` | 表示名・特徴の共通化、販売準備中の価格／フォーム非表示、FAQリンク設定 |
| `snippets/gensen-product-content.liquid` | データ参照の説明・FAQ・DAICHIカード、Figma画像配置・FAQ List装飾 |
| `snippets/gensen-product-details.liquid` | 商品補足と特徴ラベル表示を分離 |
| `snippets/gensen-product-name.liquid` | 注文用の商品名と表示用の名前・ラベルを分離 |
| `tools/refine-gensen-content.cjs` | 短い管理名・FAQ・特徴・キャッチコピーの登録処理（実行済み） |
| `tools/align-gensen-figma-content.cjs` | Figma本文・表示名の登録処理（実行済み） |

説明資料：`docs/knowledge/gensen-product-registration.md`（編集方法・掲載状態）、本ファイル（検証・共有文面・変更一覧）。

検証画像：`main-product-pc-20261027.png`（PC）、`main-product-sp-20261027.png`（SP）、`main-product-faq-20261027.png`（FAQ）、`related-product-sp-20261027.png`（実カード）、`daichi-sp-20261027.png`（準備中の詳細）。

データ証跡はすべて本ディレクトリ内。以下の各JSONを追加：

- `black-bottle-created-20261027.json`、`black-bottle-reordered-20261027.json`：黒キャップ追加と並び順。
- `coming-soon-definition-20261027.json`、`daichi-created-20261027.json`、`daichi-linked-20261027.json`：販売準備中定義・実商品登録・関連参照。
- `content-refinement-before-20261027.json`、`content-refinement-receipt-20261027.json`、`content-refinement-after-20261027.json`：管理名・FAQ・特徴の変更前／結果／読み戻し。
- `figma-content-plan-20261027.json`、`figma-content-before-20261027.json`、`figma-content-receipt-20261027.json`、`figma-content-after-20261027.json`：Figma照合・表示名・本文の変更計画／原本／結果／読み戻し。
- `layout-before-background-20261027.json`、`theme-before-content-refinement-20261027.json`：対象テーマの変更前原本。
- `product-media-after-20261027.json`：商品画像のREADY状態・並び順。
- `theme-after-20261027.json`：470e7f1時点のテーマ読み戻し。
- `final-readback-20261027.json`：bf641d8時点のテーマとDAICHI掲載状態の読み戻し。
- `theme-final-20261027.json`：6c7fdf8時点の最終テーマ6ファイルのチェックサム。

削除したファイルなし。今回の修正以外のファイルをこの一覧に混ぜていない。復旧時は対象コミットの差分と変更前JSONを参照し、必要なテーマファイルだけ戻す。ストアの商品・画像・メタフィールドはGitの復旧とは別操作。黒キャップの追加前メディアは保持している。

### 先方共有用文面（未送信）

商品ページの背景色を#222222に揃え、Figmaに合わせて黒キャップ画像・特徴ラベル・説明文・FAQを反映しました。既存の商品ページ機能を利用し、DAICHIも関連カードから詳細ページへ移動できます。DAICHIは販売準備中で価格非表示・購入不可です。PC・スマホの表示と画像切替、FAQ開閉を確認済みです。[下書きプレビュー](https://ichido.co/products/gensensui-water?preview_theme_id=200718221472&view=gensen)で見た目と掲載内容をご確認ください。本番テーマは未公開です。特徴ラベル・FAQの正式文言、共通FAQのリンク先、Mikawaya連携は公開前の設定事項として残っています。

---

## main-product移行とFigma再照合（2026-10-27）

- 着手前に共有済み[下書き商品プレビュー](https://ichido.co/products/gensensui-water?preview_theme_id=200718221472&view=gensen)を確認。専用セクションの旧表示が残っていた。
- ブランチは `online-store`。前回の未コミット修正を `5b01fa8` に保存し、Shopify側の `1db038f` までをマージしてから作業開始。他担当の更新は保持。
- CLI Connectorの商品管理認証に成功。商品・メタフィールド・メタオブジェクト・画像操作とテーマ読み取りに必要な権限で接続。テーマ用CLIの別認証はアクセスエラーのため、GitHub連携で反映する。
- 対象テーマは `gid://shopify/OnlineStoreTheme/200718221472`、`zdg0an-69/online-store`、UNPUBLISHED。変更前の3ファイルを `theme-before-main-product-20261027.json`、layout原本を `data-after-20261027.json` のtheme部分に保存。Gitの作業開始時原本との一致を確認。
- `main-product.liquid` のギャラリー、購入フォーム、価格、数量、在庫、バリエーション、アプリブロックをそのまま利用し、GENSEN用のスタイルと商品メタフィールド表示を追加。専用の商品フォーム・静的なタイトル・定期購入の灰色仮枠は新テンプレートで使わない。
- ユーザー追記により専用ヘッダー・フッターを廃止し、共通header-group/footer-groupを利用。別担当の共通デザイン自体には手を加えない。
- 商品データ追加はユーザー承認済み。ストア所有の編集項目6定義、説明・FAQの2定義、説明5エントリー、画像5点を作成。`seo.hidden=1`、商品補足、説明の参照を保存・読み戻し確認。価格・在庫・status・元のdescriptionHtml・templateSuffixの一致を確認。画像5点READY。
- 後続のユーザー指示で、特徴ラベル4件とダミーFAQ5件を登録。DAICHIを関連商品として作成・参照済み。DAICHIはユーザーがUNLISTED・オンラインストア掲載を完了し、関連カードから詳細への実遷移を確認済み。Mikawayaの実連携は未実施。
- Theme Check 0エラー・15警告。ToolkitのLiquid検証は内部のFileType exportエラーで実行不能。Admin GraphQLの操作はToolkit検証成功。
- ボタンは色反転・オレンジ罫線のtransition。FAQは開閉アニメーションとreduced-motion対応。検証結果は冒頭の最終確認を参照。

### 追加のデータ・デザイン修正

- 管理用の短い名前と見出し・本文を分離。キャッチコピーは商品単位の直接編集項目として共用。
- ユーザー指定でFigmaの特徴ラベル4件・FAQ5件を登録。FAQ回答は準備中。
- Figmaとの再照合により表示名・補足ラベル・5説明セクションの本文と段落を修正。注文等で使う商品標準のtitle/descriptionHtmlは維持。
- GENSENのページ全体は#222222、画像枠・FAQ・Other Productパネルは#000000。共通ヘッダー・フッターの制作は対象外。
- 指定の黒キャップ画像を商品メディアへ追加して先頭へ移動。元の白キャップ画像は削除せず残した。メディアの表示順は全テーマ共通。
- DAICHIは価格未確定。coming_soon=true、在庫追跡0・DENY・seo.hidden=1。ユーザーによるオンラインストア掲載完了をAPI・実画面で確認。

### 今回の変更ファイル

実装・運用コード：

- `sections/main-product.liquid`：既存セクションにGENSEN用スタイル指定、商品補足ブロック、説明コンテンツを追加。
- `templates/product.gensen.json`：main-productの標準ブロック構成へ移行。
- `assets/product-info.js`：GENSENプレビューのバリエーション更新時にviewパラメーターを維持。
- `assets/gensen-main-product.css`：標準コンポーネントのレイアウト・色・hover・transition。
- `assets/gensen-interactions.js`：FAQ開閉アニメーション、連打・reduced-motion対応。
- `snippets/gensen-product-content.liquid`：商品参照の説明・FAQ・関連商品。未登録時の分岐。
- `layout/theme.liquid`：共通ヘッダー・フッターの非表示分岐を解除。
- `tools/migrate-gensen-product-data.cjs`：対象商品限定・元データ照合・二重実行防止付きの移行処理。

資料・証跡：

- `docs/knowledge/gensen-product-registration.md`：編集項目・運用手順・現在値。
- 本ファイル：移行の記録と復旧情報。
- `data-before-20261027.json`：商品と既存定義の移行前原本。
- `data-migration-plan-20261027.json`：追加項目と既存説明文の分割結果。
- `data-migration-receipt-20261027.json`：作成リソースIDと各操作結果。
- `data-after-20261027.json`：商品・参照画像の読み戻しとlayout原本。
- `theme-before-main-product-20261027.json`：変更前テーマファイル原本。

復旧は上記原本と後続差分を比較して対象ファイルだけ戻す。ストアデータは別操作で、説明参照を外せば元の商品説明へフォールバックする。追加データを削除する場合は他商品の参照を確認してから実施し、定義の一括削除はしない。復旧手順の実行は未検証。

以下は初回実装・前回修正の履歴で、現行状態はこの節と後続の確認結果を優先する。

確認日: 2026-10-22（JST）

## スキーマエラー修正後の最新状態

下記の初回記録より、この節の状態を優先する。

- 商品 `gensensui-water` はユーザーにより登録済み。[確認済みの商品プレビュー](https://ichido.co/products/gensensui-water?preview_theme_id=200718221472&view=gensen)で新デザインが表示される。`view=gensen` で専用テンプレートを指定しており、通常URLへの恒久割当は未実施。
- 原因は同一セクション内の2つの `link_list` 設定。Shopifyがセクション登録を拒否し、続いてテンプレート登録も失敗していた。同期遅延だけで説明できる状態ではなかった。
- ヘッダーメニューを残し、フッターを表示名・URLの `footer_link` ブロックに変更。未追加時は既存のストアポリシーを表示する。
- CLI再認証後、対象テーマ `200718221472` が `unpublished` であることを確認。修正前に対象2ファイルだけpullしたが、両ファイルは登録失敗で存在せず原本なし。
- `sections/gensen-product.liquid` と `templates/product.gensen.json` のみ `--nodelete --strict` でアップロードし、終了コード0・サーバーエラーなし。テンプレートの内容変更はなし。
- Theme Checkは0エラー・15警告。Toolkitは引き続き内部の `FileType` exportエラーで実行不能。静的検証では今回のサーバー制約を検出できなかったため、アップロード結果と実ページ表示を完了条件にする。
- 実ストアのPC 1440px／SP 375pxで新デザイン、画像、FAQ開閉、メニュー、販売準備中の無効ボタンを確認。横はみ出しなし。初回のSVG2点の読込不良は再読み込み後に解消し、下部まで確認した時点で読込失敗画像0件・コンソールエラー／警告0件。SVG自体は変更していない。
- 商品画像は登録済みの白キャップの画像1点で、Figmaの仮画像とは異なる。実カート追加・決済、商品データ変更、`seo.hidden` 設定、恒久的なテンプレート割当、本番公開は未実施。Mikawayaは仮表示。
- 証跡：[実ストアPC](shopify-product-pc.jpg)／[実ストアSP](shopify-product-sp.jpg)。以下の旧PC/SP証跡はローカル模擬表示。
- 修正後の `git diff --check` は正常。Gitリモート確認コマンドの実行が承認されなかったため、今回の修正は未コミット・未プッシュ。下書きテーマへのCLI反映は完了済みだが、Git側への保存が残っている。

### 今回の変更ファイル

- 実装：`sections/gensen-product.liquid` — 重複link_listを解消しフッターリンクブロックを追加。
- 資料：`docs/verification/gensen/README.md` — 原因、修正、実ストア検証、共有文面を更新。
- 資料：`docs/knowledge/gensen-product-registration.md` — 登録済み商品の再利用と残作業を追記。
- 証跡：`docs/verification/gensen/shopify-product-pc.jpg`、`docs/verification/gensen/shopify-product-sp.jpg` — 実ストア画像を新規保存。
- 削除ファイルなし。`templates/product.gensen.json` は内容変更せず再アップロード。

### 最新の先方共有用文面

GENSEN商品ページの登録エラーを修正し、下書きテーマへ反映しました。[商品ページのプレビュー](https://ichido.co/products/gensensui-water?preview_theme_id=200718221472&view=gensen)でPC・スマートフォン表示を確認済みです。レイアウト、登録済みの商品画像、FAQ・成分バッジの正式文言をご確認ください。定期購入は仮表示、購入ボタンは販売準備中です。本番公開は行っていません。通常の商品URLへのテンプレート割当と検索非表示設定は未実施です。

---

以下は初回実装時の記録。商品未登録・CLI権限不足・商品表示未検証という記載は当時の状態で、現在は上記を参照。

## 対象と状態

- 作業ルート: `/Users/roomsadbeats/Documents/GitHub/zdg0an-69`
- ブランチ: `online-store`。変更前HEAD: `71c6e6d511592efa488fc357ff0480587262442e`。着手時の作業差分なし。
- ストア: ユーザー指定 `zdg0an-69.myshopify.com`。Admin APIでの再取得確認は認可権限不足で未実施。
- [共有済みテーマプレビュー](https://ichido.co/?_ab=0&_fd=0&_sc=1&preview_theme_id=200718221472): ブラウザで表示確認。プレビューバーのテーマ名 `zdg0an-69/online-store`、状態 `Draft` を確認。トップのティザーが表示される。
- 商品未登録のため、完成した商品ページを確認できる共有URLはまだない。ローカル画像は商品データを模擬した表示であり、Shopify実商品の表示確認とは区別する。
- Figma: [PC 166:404](https://www.figma.com/design/z4k23J16hrPbravtdX4dkO/ichido?node-id=166-404&m=dev)、[SP 166:987](https://www.figma.com/design/z4k23J16hrPbravtdX4dkO/ichido?node-id=166-987&m=dev)。MCPから両方の構造・見た目・原本画像を取得。
- このブランチへの今回の改修のプッシュはユーザーから明示承認済み。本番テーマへの公開切替は行わない。
- リモートテーマファイルの原本取得はAPI権限がなく未実施。Git変更前HEADをコードの復旧元とする。新規ファイルには旧原本なし。

## 実装

`product.gensen` 専用の商品ページを追加。PCの左右2列と追従する購入欄、SPの縦積み、商品画像とサムネイル、商品紹介5ブロック、FAQ、関連商品、ヘッダー・フッターを実装。既存の `product-form.js` を利用し、実際の商品バリエーション・在庫・数量ルールに連動する。

このテーマの「トップ以外をトップへ戻す」meta refresh／JavaScriptリダイレクトを削除した。商品ページだけを例外化する方式ではなく、ユーザーの指示どおりテーマの当該処理を除去した。

Figmaとの差異・確定待ち:

- SPデザインのiPhoneステータスバー45pxはブラウザ側UIのためページに含めない。
- FAQはPCの5件に統一。SPデザインは4件だが、同じ内容を端末によって隠さない。
- 購入ボタンは初期状態「販売準備中」。Mikawaya・FAQ・成分バッジは指定どおり仮の内容。
- 未設定の外部ページはダミーURLにリンクせず、テキスト表示／同一ページ内導線にする。
- UIラベルは日本語・英語を追加。他言語ファイルには新規キーの英語フォールバックだけを追加し、既存の訳文を変更していない。本文の多言語化は未実施。

## 検証結果

| 確認項目 | 環境・操作 | 実測・判定 |
| --- | --- | --- |
| 静的検証 | Shopify CLI `theme check` | エラー0件。警告15件（変更前12件＋Google FontsのRemoteAsset警告3件） |
| Toolkit検証 | `validate.mjs --api liquid --theme-path … --files …` | ツールのCommonJS `FileType` exportエラーで実行不能。上記CLIで代替。Toolkit成功とは扱わない |
| JavaScript・差分 | `node --check assets/gensen-product.js`、`git diff --check` | 確認済み、エラーなし |
| PCレイアウト | Codex内ブラウザ、1440px幅 | 商品画像・購入欄・各セクション・画像読込・横はみ出しなしを確認 |
| SPレイアウト | 同ブラウザ375px幅 | ギャラリー→購入欄→紹介の順序、余白・FAQ・フッター、横はみ出しなしを確認 |
| 中間幅 | 320 / 768 / 1024px | document幅がviewportを超えないことを確認 |
| 未登録メディア | ローカル模擬商品、メディア0件 | Figmaボトル画像と仮サムネイルを表示 |
| ギャラリー | 模擬商品2画像のサムネイルをクリック | 表示画像とaria-pressedが切り替わることを確認 |
| メニュー | SPで開き、FAQリンクを選択 | FAQへ移動し、メニューが閉じることを確認 |
| FAQ | 質問を開閉 | 回答表示と開閉状態を確認 |
| 販売準備中 | 初期設定 | 追加ボタンdisabledを確認 |
| 売り切れ | 模擬の売り切れバリエーションを選択 | 価格更新・売り切れ表示・追加不可を確認 |
| 定期購入専用 | 模擬バリエーションを選択／直接表示 | 準備中表示・追加不可を確認 |
| 数量ルール | min2 / step2の商品に数量3を入力・送信 | ブラウザの入力エラーで送信されないことを確認 |
| カートAPIエラー | ローカル模擬422応答 | エラーメッセージが表示され、ローディング解除・再操作可能 |
| カート正常系 | 数量2に修正して再送信、ローカル模擬成功応答 | `/cart` への遷移を確認。実ストア送信なし |
| コンソール | ローカルの上記操作後にログ取得 | JavaScriptエラー・警告0件 |
| 実ストアの商品・カート・決済 | 商品未登録／権限なし | 未検証。商品登録後に確認が必要 |
| Mikawaya | 仮枠のみ | 未検証。アプリ導入後に別途連携 |
| seo.hidden | 設計のみ | 未設定・未検証 |
| iPhone/Android実機 | 物理端末を使用していない | 未検証。SP幅のブラウザ検証のみ |

ローカル表示はLiquidJSで実際のセクション・CSS・JSを読み、Shopifyオブジェクト・URLフィルター・カート応答を模擬したもの。Shopifyの全レイアウト・アプリ・実APIを再現したものではない。テスト用価格・商品IDはテーマファイルに保存していない。

## 証跡

- [PC先頭](pc-firstview.jpg) / [PC全体](pc-1440.jpg)
- [SP先頭](sp-firstview.jpg) / [SP全体](sp-375.jpg)
- [下書きテーマのカート表示](draft-cart.jpg)（リダイレクト削除後）
- [商品登録・検索非表示の設計](../../knowledge/gensen-product-registration.md)

## 反映と復旧

GitHubへのプッシュ結果とプレビューへの同期結果は、末尾の「反映確認」に記録する。テーマの公開切替、商品データの書込み、Mikawaya設定は今回実施しない。

復旧が必要な場合は、今回の商品ページ実装コミットを対象に後続変更を確認し、競合を解消しながら `git revert` する。変更前の `layout/theme.liquid` と各localeは上記HEADに保存されている。今回の新規テンプレート・セクション・スニペット・gensenアセットは後続利用を確認したうえで戻す。テーマ全体の上書きや `git reset --hard` は使わない。復元後にTheme Check、対象プレビュー、トップ／商品／カート導線を再確認する。復旧手順の実行は未検証。

商品が今後登録された場合は、テンプレートを削除する前に割当先を変更する。商品・メタフィールドの変更はGitを戻しても復旧しない。

## 先方共有用文面

GENSENの商品ページをPC・スマートフォン向けに実装し、online-storeブランチへ反映しました。このテーマのトップページへの強制リダイレクトを削除し、下書きテーマのカートページで反映を確認しています。画像切り替え、FAQ、数量制限、カート追加の正常・異常系はローカル環境で確認済みです。

共有済みの[テーマプレビュー](https://ichido.co/?_ab=0&_fd=0&_sc=1&preview_theme_id=200718221472)は確認できていますが、商品が未登録のため、商品ページ自体はまだこのリンクから確認できません。添付のPC/SP確認画像でレイアウトをご確認ください。FAQ・成分バッジの正式文言、商品価格等の登録情報が確定後、商品登録と検索非表示設定を行い、商品ページの確認URLを発行します。Mikawayaの定期購入部分は仮表示です。本番公開は行っていません。

## 変更ファイル一覧

### 実装ファイル

| ファイル | 変更概要 |
| --- | --- |
| `assets/gensen-account-mobile.svg` | Figma原本アセット追加：SPアカウントアイコン |
| `assets/gensen-account.svg` | Figma原本アセット追加：PCアカウントアイコン |
| `assets/gensen-announcement-arrow.svg` | Figma原本アセット追加：お知らせ矢印 |
| `assets/gensen-arrow.svg` | Figma原本アセット追加：フッターボタン矢印 |
| `assets/gensen-bottle.png` | Figma原本アセット追加：ボトル原本 |
| `assets/gensen-button-fill-mobile.svg` | Figma原本アセット追加：SP塗りボタン |
| `assets/gensen-button-fill.svg` | Figma原本アセット追加：PC塗りボタン |
| `assets/gensen-button-outline-mobile.svg` | Figma原本アセット追加：SP線ボタン |
| `assets/gensen-button-outline.svg` | Figma原本アセット追加：PC線ボタン |
| `assets/gensen-cart-mobile.svg` | Figma原本アセット追加：SPカートアイコン |
| `assets/gensen-cart.svg` | Figma原本アセット追加：PCカートアイコン |
| `assets/gensen-chevron.svg` | Figma原本アセット追加：連絡先導線矢印 |
| `assets/gensen-facility.jpg` | Figma原本アセット追加：採水施設写真原本 |
| `assets/gensen-footer-logo.svg` | Figma原本アセット追加：フッターロゴ |
| `assets/gensen-lake.jpg` | Figma原本アセット追加：導入の湖写真原本 |
| `assets/gensen-logo.svg` | Figma原本アセット追加：ヘッダーロゴ |
| `assets/gensen-menu.svg` | Figma原本アセット追加：メニューアイコン |
| `assets/gensen-mineral.jpg` | Figma原本アセット追加：ミネラル写真原本 |
| `assets/gensen-placeholder.svg` | Figma原本アセット追加：画像未設定サムネイル |
| `assets/gensen-point-mobile.svg` | Figma原本アセット追加：SPポイントマーカー |
| `assets/gensen-point.svg` | Figma原本アセット追加：PCポイントマーカー |
| `assets/gensen-product.css` | PC/SPレイアウト・フォーカス・各部スタイル |
| `assets/gensen-product.js` | 画像切替・メニュー・バリエーションと購入制御 |
| `assets/gensen-protein.png` | Figma原本アセット追加：関連商品画像原本 |
| `assets/gensen-source.jpg` | Figma原本アセット追加：水源写真原本 |
| `assets/gensen-waterfall.jpg` | Figma原本アセット追加：滝写真原本 |
| `layout/theme.liquid` | 強制リダイレクト削除、GENSEN専用CSS・フォント・ヘッダー／フッター分岐 |
| `locales/bg.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/cs.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/da.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/de.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/el.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/en.default.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/es.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/fi.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/fr.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/hr.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/hu.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/id.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/it.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/ja.json` | 新規GENSEN UIキー追加（日本語） |
| `locales/ko.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/lt.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/nb.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/nl.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/pl.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/pt-BR.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/pt-PT.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/ro.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/ru.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/sk.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/sl.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/sv.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/th.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/tr.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/vi.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/zh-CN.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `locales/zh-TW.json` | 新規GENSEN UIキー追加（英語フォールバック、既存訳文は保持） |
| `sections/gensen-product.liquid` | 商品ページ本体と編集可能なセクション設定 |
| `snippets/gensen-button-art.liquid` | Figma原本のPC/SPボタン装飾 |
| `templates/product.gensen.json` | GENSEN専用テンプレートと初期コンテンツ |

### 説明資料・検証画像

| ファイル | 変更概要 |
| --- | --- |
| `docs/knowledge/gensen-product-registration.md` | 商品構成・下書き・seo.hidden・Mikawaya導入手順 |
| `docs/verification/gensen/README.md` | 検証・変更一覧・反映状態・復旧・先方共有文面 |
| `docs/verification/gensen/draft-cart.jpg` | 下書きテーマのリダイレクト削除反映を確認したブラウザ画像 |
| `docs/verification/gensen/pc-1440.jpg` | ローカル検証画像（PC） |
| `docs/verification/gensen/pc-firstview.jpg` | ローカル検証画像（PC） |
| `docs/verification/gensen/sp-375.jpg` | ローカル検証画像（SP） |
| `docs/verification/gensen/sp-firstview.jpg` | ローカル検証画像（SP） |

ファイル自体の削除はなし。リダイレクト処理のみ既存ファイルから除去。

## 反映確認

- 実装コミット: `2d97cbef155dba342669057962e0ba737c8d65c7`。`origin/online-store` へのプッシュ成功とリモートSHA一致を確認した。
- 直後の初回確認では旧リダイレクトが残っていたが、同期後の再確認で [下書きテーマのカート](https://ichido.co/cart?preview_theme_id=200718221472) が `/cart` のまま表示された。ページタイトルは「ショッピングカート – ichido」、カートは空、meta refreshなし。商品追加は行っていない。
- プレビューバーは `zdg0an-69/online-store` / `Draft`。今回のリダイレクト削除の反映を実ブラウザで確認済み。本番への公開切替なし。
- 商品テンプレートの実商品への割当・表示は、商品未登録のため未検証。商品ページ全体のリモート反映成功を確認したという意味ではない。
- viewportは復元し、ローカル検証タブを閉じた。サーバーは検証終了後に停止。
