# GENSEN 商品ページ 実装・検証記録

確認日: 2026-10-22（JST）

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
