# Caching

App Router のキャッシュに関するドキュメントと図解

## Next.js App Router キャッシングレイヤー

キャッシングの全体的なフローを視覚化し、各キャッシュレイヤーがリクエストをどのように処理するかを示しています。
Router CacheからData Cacheまでの一連の処理とキャッシュヒットの判断ロジックを表現しています。

```mermaid
flowchart TD
    subgraph "Next.js App Router キャッシングレイヤー"
        A[リクエスト] --> B[Router Cache]
        B --> C{キャッシュヒット?}
        C -->|Yes| D[キャッシュされた結果を返す]
        C -->|No| E[Full Route Cache]
        E --> F{キャッシュヒット?}
        F -->|Yes| G[キャッシュされたルート結果を返す]
        F -->|No| H[ルートのレンダリング]
        H --> I[データフェッチ]
        I --> J[Request Memoization]
        J --> K{同一リクエスト?}
        K -->|Yes| L[メモ化された結果を返す]
        K -->|No| M[Data Cache]
        M --> N{キャッシュヒット?}
        N -->|Yes| O[キャッシュされたデータを返す]
        N -->|No| P[データフェッチの実行]
        P --> Q[結果をキャッシュ]
        Q --> R[レンダリング完了]
        R --> S[ルートをキャッシュ]
        S --> D
    end
```

## Next.js キャッシュの種類と関係性

クラス図を使用して、4つの主要なキャッシュタイプ（Request Memoization、Data Cache、Full Route Cache、Router Cache）の特性と関係性を示しています。
各キャッシュの役割と相互作用を明確に表現しています。

```mermaid
classDiagram
    class RequestMemoization {
        +単一のRSCペイロード内でデータフェッチを重複排除
        +サーバーリクエスト中のみ有効
        +フェッチリクエストのメモ化
    }

    class DataCache {
        +fetch()リクエストの結果を保存
        +永続的キャッシュ
        +サーバー再起動後も維持
        +時間または手動でリバリデート可能
    }

    class FullRouteCache {
        +RSCペイロードとHTMLをキャッシュ
        +静的レンダリングで生成
        +ビルド時または初回アクセス時に生成
        +再検証トリガーで無効化
    }

    class RouterCache {
        +クライアント側のナビゲーションキャッシュ
        +ユーザーセッション中のみ有効
        +prefetchedルートを保存
        +ブラウザのメモリに保存
    }

    RequestMemoization --> DataCache : データが未メモ化の場合
    DataCache --> FullRouteCache : 静的レンダリング時に使用
    FullRouteCache --> RouterCache : クライアントナビゲーション時に活用
```

## fetch() オプションとキャッシュ動作

fetch()関数の各種オプション（cache、revalidate）がキャッシュ動作にどう影響するかをフローチャートで示しています。
POSTリクエストのデフォルト動作やレンダリングへの影響も表現しています。

```mermaid
flowchart TD
    A[fetch リクエスト] --> B{cache オプション}
    B -->|'force-cache'| C[Data Cache に保存]
    B -->|'no-store'| D[キャッシュなし]
    B -->|未指定| C

    A --> E{next.revalidate オプション}
    E -->|設定あり| F[時間ベースの再検証]
    E -->|未設定| G[永続的キャッシュ]

    A --> H{POST リクエスト}
    H -->|Yes| I[デフォルトで no-store]
    H -->|No| J[デフォルトで force-cache]

    C --> K[静的レンダリングが可能]
    D --> L[動的レンダリングに強制]
```

## Next.js キャッシュの再検証方法

時間ベースの再検証とオンデマンド再検証、およびキャッシュクリアの方法を整理して示しています。
revalidateTag、revalidatePath、動的関数の使用など、各種再検証方法を並列して表示しています。

```mermaid
flowchart LR
    subgraph "時間ベースの再検証"
        A[fetch with revalidate] --> B[指定時間後に自動的に再検証]
        C[ルートセグメントの設定] --> D[segment config で revalidate 設定]
    end

    subgraph "オンデマンド再検証"
        E[タグベース] --> F["revalidateTag('tag-name')"]
        G[パスベース] --> H["revalidatePath('/path')"]
    end

    subgraph "キャッシュクリア"
        I[Server Action] --> J["unstable_cache() インバリデーション"]
        K[Route Handler] --> L["cookies() または headers() 使用"]
        M[動的関数] --> N["searchParams, cookies, headers の使用"]
    end

    O[キャッシュされたコンテンツ] --> A
    O --> C
    O --> E
    O --> G
    O --> I
    O --> K
    O --> M
```

## 静的レンダリングと動的レンダリングの比較

静的レンダリングと動的レンダリングの特性、メリット、使用条件を対比して示しています。
どのような条件で動的レンダリングが選択されるかを明確にしています。

```mermaid
graph TD
    subgraph "静的レンダリング"
        A[ビルド時にレンダリング] --> B[データはキャッシュされる]
        B --> C[Full Route Cache に保存]
        C --> D[高速なユーザー体験]
        D --> E[低サーバー負荷]
    end

    subgraph "動的レンダリング"
        F[リクエスト時にレンダリング] --> G[データはキャッシュされない]
        G --> H[リクエストごとに新鮮なデータ]
        H --> I[ユーザー固有のコンテンツ]
        I --> J[より高いサーバー負荷]
    end

    K[ルートデータ要件] --> A
    K --> F

    L{動的関数の使用} -->|Yes| F
    L -->|No| A

    M{fetch with no-store} -->|Yes| F
    M -->|No| A

    N{動的なSegment Config} -->|Yes| F
    N -->|No| A
```

## Router Cache の動作と制御

シーケンス図を使って、ユーザーのナビゲーションとRouter Cacheの相互作用を時系列で示しています。
prefetch、ハード更新、router.refresh()などの動作の違いを表現しています。

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant RC as Router Cache
    participant S as サーバー

    U->>RC: ページA訪問
    RC->>S: 初回リクエスト
    S-->>RC: RSCペイロード/HTML返却
    RC-->>U: ページ表示

    U->>RC: ページB訪問 (prefetchあり)
    RC->>S: バックグラウンドでprefetch
    S-->>RC: RSCペイロード保存

    U->>RC: ページBに戻る
    RC-->>U: キャッシュから即時表示

    U->>RC: ハード更新
    RC->>S: 全キャッシュ破棄
    S-->>RC: 新規データ取得
    RC-->>U: 更新されたページ表示

    Note over RC: router.refresh()でソフト更新
    U->>RC: router.refresh()
    RC->>S: 現在のルートのみ再取得
    S-->>RC: 更新データのみ取得
    RC-->>U: 動的部分のみ更新
```

## キャッシュ戦略の決定フロー

プロジェクトのデータ要件に基づいて、適切なキャッシュ戦略を選択するための意思決定フローを示しています。
静的vs動的、再検証頻度、ユーザー固有データの必要性などの条件分岐を含みます。

```mermaid
flowchart TD
    A[データ要件分析] --> B{データは頻繁に変更する?}
    B -->|Yes| C[動的レンダリング検討]
    B -->|No| D[静的レンダリング検討]

    C --> E{ユーザー固有のデータが必要?}
    E -->|Yes| F[no-store オプション使用]
    E -->|No| G{一部だけ動的?}
    G -->|Yes| H[静的部分と動的部分の分離]
    G -->|No| F

    D --> I{定期的な更新が必要?}
    I -->|Yes| J[時間ベース再検証]
    I -->|No| K[完全静的キャッシュ]

    J --> L{更新頻度は?}
    L -->|高頻度| M[短い再検証時間]
    L -->|低頻度| N[長い再検証時間]

    K --> O{特定イベントで更新?}
    O -->|Yes| P[オンデマンド再検証]
    O -->|No| Q[ビルド時のみ更新]

    H --> R[Suspenseと組み合わせ]
    F --> S[パフォーマンス最適化検討]

    M --> T[サーバー負荷考慮]
    N --> T
    P --> U[タグベース設計]
    Q --> V[ISRパターン活用]

    R --> W[効率的なUX]
    S --> W
    T --> W
    U --> W
    V --> W
```
