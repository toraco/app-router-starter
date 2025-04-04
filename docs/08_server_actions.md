# Next.js App Router データ取得と再検証の解説動画

## 動画構成

1. **イントロダクション**

   - 挨拶と今回のテーマ紹介
   - Next.js App Routerのデータフェッチングの重要性

2. **fetch options.next.revalidate**

   - 概念説明
   - 使用方法と実装例
   - ユースケースとベストプラクティス

3. **fetch options.next.tags と revalidateTag**

   - タグベースの再検証の仕組み
   - 実装方法とサンプルコード
   - 効果的な使用シナリオ

4. **revalidatePath / revalidateTag**

   - オンデマンド再検証の概念
   - 両メソッドの違いと使い分け
   - 実装例

5. **Server Actions**

   - Server Actionsの基本概念
   - フォーム処理との統合
   - データ変更後の再検証パターン

6. **まとめとベストプラクティス**
   - 各機能のまとめ
   - ユースケース別の機能選択ガイド
   - パフォーマンスとUXの最適化ポイント

## 原稿

### 1. イントロダクション

Next.js App Routerにおけるデータ取得と再検証（revalidation）機能の概要説明。Next.js 13から導入されたApp Routerは、React Server Componentsを活用した新しいデータフェッチングアプローチを採用している。

本動画で解説する主要機能：

- fetch options.next.revalidate
- fetch options.next.tags と revalidateTag
- revalidatePath と revalidateTag
- Server Actions

これらの機能理解により、効率的なデータ取得と更新戦略の実装が可能となる。

### 2. fetch options.next.revalidate

#### 概念説明

`fetch` APIに追加された `options.next.revalidate` は、特定のデータをキャッシュする期間を秒単位で指定できる機能。この機能により、静的な生成（Static Generation）と動的なデータ更新のバランスを実現可能。

#### 使用方法と実装例

```typescript
// ブログ記事を10秒ごとに再検証するfetch
async function getBlogPost(id: string): Promise<BlogPost> {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: { revalidate: 10 } // 10秒ごとに再検証
  });

  if (!res.ok) {
    throw new Error('記事の取得に失敗しました');
  }

  return res.json();
}

// ページコンポーネントでの使用例
export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await getBlogPost(params.id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>最終更新: {new Date().toLocaleString()}</p>
    </article>
  );
}
```

キャッシュの動作フロー：

1. 最初のリクエスト：データがフェッチされ、キャッシュに保存される
2. 10秒以内の次のリクエスト：キャッシュされたデータが返される
3. 10秒経過後の最初のリクエスト：バックグラウンドで再検証が行われ、現在のリクエストにはキャッシュされたデータが返される
4. 再検証後のリクエスト：更新されたデータが返される

#### ユースケースとベストプラクティス

- ブログ記事、商品情報など頻繁に更新されないコンテンツに最適
- 更新頻度に合わせた適切な期間設定が重要
- `revalidate: 0`を指定すると、常に最新のデータを取得（動的レンダリング）
- `revalidate: 60 * 60 * 24`のように1日単位などの長い期間設定も可能

### 3. fetch options.next.tags と revalidateTag

#### タグベースの再検証の仕組み

タグベースの再検証は、時間ベースの再検証をさらに発展させた機能。特定のデータに「タグ」を付けることで、そのタグに関連するすべてのデータを一度に再検証可能。

#### 実装方法とサンプルコード

まず、fetchリクエストにタグを付ける：

```typescript
// 製品データにタグを付ける
async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: {
      tags: ['products', `product-${id}`] // タグを付ける
    }
  });

  if (!res.ok) {
    throw new Error('製品の取得に失敗しました');
  }

  return res.json();
}

// 製品一覧ページ
export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products', {
    next: { tags: ['products'] }
  }).then(res => res.json());

  return (
    <div>
      <h1>商品一覧</h1>
      <ul>
        {products.map((product: Product) => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>
              {product.name} - ¥{product.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

そして、特定のタグに関連するデータを再検証：

```typescript
// Server Action内での使用例
'use server'

import { revalidateTag } from 'next/cache'

export async function updateProductPrice(id: string, newPrice: number) {
  // APIを呼び出して製品価格を更新
  const response = await fetch(`https://api.example.com/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price: newPrice }),
  })

  if (response.ok) {
    // 製品関連のキャッシュを再検証
    revalidateTag('products')
    revalidateTag(`product-${id}`)
    return { success: true }
  } else {
    return { success: false, error: '価格の更新に失敗しました' }
  }
}
```

#### 効果的な使用シナリオ

- 関連するデータが複数ページにまたがる場合
- 特定のカテゴリやセクションのデータを一括で更新したい場合
- CMS連携など、外部システムからの更新をトリガーにする場合

タグの階層構造を持たせる命名規則例：

- `products`: 全製品に関連するデータ
- `product-{id}`: 特定の製品に関連するデータ
- `category-{categoryId}`: 特定のカテゴリに関連するデータ

### 4. revalidatePath / revalidateTag

#### オンデマンド再検証の概念

`revalidatePath`と`revalidateTag`は、指定されたパスやタグに関連するキャッシュを任意のタイミングで再検証するための関数。これらはServer ComponentsやServer Actionsから呼び出し可能。

#### 両メソッドの違いと使い分け

- `revalidatePath`: URLパスに基づいてキャッシュを再検証
- `revalidateTag`: 特定のタグに関連するすべてのキャッシュを再検証

#### 実装例

```typescript
// revalidatePath の使用例
'use server'

import { revalidatePath } from 'next/cache'

export async function publishArticle(id: string) {
  // APIを呼び出して記事を公開状態に変更
  const response = await fetch(`https://api.example.com/articles/${id}/publish`, {
    method: 'POST',
  })

  if (response.ok) {
    // 記事詳細ページと一覧ページを再検証
    revalidatePath(`/articles/${id}`)
    revalidatePath('/articles')
    return { success: true }
  } else {
    return { success: false, error: '記事の公開に失敗しました' }
  }
}

// revalidateTag の使用例
;('use server')

import { revalidateTag } from 'next/cache'

export async function updateCategoryProducts(categoryId: string) {
  // カテゴリ内の商品を更新するAPI呼び出し
  const response = await fetch(`https://api.example.com/categories/${categoryId}/update`, {
    method: 'POST',
  })

  if (response.ok) {
    // カテゴリに関連するすべてのデータを再検証
    revalidateTag(`category-${categoryId}`)
    return { success: true }
  } else {
    return { success: false, error: 'カテゴリの更新に失敗しました' }
  }
}
```

使い分けの基準：

- `revalidatePath`: 特定のページやURLパターンに関連するキャッシュを更新する場合
  - 例: ブログ記事の更新後、その記事ページと一覧ページを再検証
- `revalidateTag`: 関連するデータが複数のページにまたがる場合
  - 例: 製品価格の更新後、その製品に関連するすべてのページを再検証

### 5. Server Actions

#### Server Actionsの基本概念

Server Actionsは、クライアントコンポーネントからサーバーサイドの関数を直接呼び出せる機能。これにより、フォーム送信やデータ更新などのサーバーサイド処理をシームレスに実装可能。

#### フォーム処理との統合

```typescript
// app/products/[id]/edit/page.tsx
'use client';

import { updateProduct } from './actions';
import { useState } from 'react';

interface FormData {
  name: string;
  price: number;
  description: string;
}

interface StatusResult {
  success: boolean;
  error?: string;
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: 0,
    description: ''
  });

  const [status, setStatus] = useState<StatusResult | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'number'
      ? parseFloat(e.target.value)
      : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await updateProduct(params.id, formData);
    setStatus(result);
  };

  return (
    <div>
      <h1>商品編集</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">商品名</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="price">価格</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description">説明</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit">更新</button>
      </form>

      {status && (
        <div className={status.success ? 'success' : 'error'}>
          {status.success ? '更新しました' : `エラー: ${status.error}`}
        </div>
      )}
    </div>
  );
}
```

Server Actionの実装：

```typescript
// app/products/[id]/edit/actions.ts
'use server'

import { revalidateTag } from 'next/cache'
import { redirect } from 'next/navigation'

interface ProductData {
  name: string
  price: number
  description: string
}

interface UpdateResult {
  success: boolean
  error?: string
}

export async function updateProduct(id: string, data: ProductData): Promise<UpdateResult> {
  try {
    const response = await fetch(`https://api.example.com/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('商品の更新に失敗しました')
    }

    // 関連するキャッシュを再検証
    revalidateTag('products')
    revalidateTag(`product-${id}`)

    // 更新成功後にリダイレクト（オプション）
    redirect(`/products/${id}`)

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
    }
  }
}
```

#### データ変更後の再検証パターン

Server Actionsとrevalidation機能を組み合わせることで、実装可能な主要パターン：

1. **更新および再検証パターン**:
   データを更新し、関連するキャッシュを再検証

   ```typescript
   'use server'

   import { revalidateTag } from 'next/cache'

   export async function addComment(postId: string, comment: string) {
     const response = await fetch(`https://api.example.com/posts/${postId}/comments`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ content: comment }),
     })

     if (response.ok) {
       // コメント関連のキャッシュを再検証
       revalidateTag(`post-${postId}`)
       return { success: true }
     } else {
       return { success: false, error: 'コメントの追加に失敗しました' }
     }
   }
   ```

2. **Optimistic Update パターン**:
   クライアント側で即座に表示を更新し、バックグラウンドでサーバー処理を実行

   ```typescript
   'use client';

   import { useState } from 'react';
   import { addComment } from './actions';

   interface Comment {
     id: string;
     content: string;
     createdAt: string;
   }

   interface CommentFormProps {
     postId: string;
     onAddComment: (comment: Comment) => void;
   }

   export default function CommentForm({ postId, onAddComment }: CommentFormProps) {
     const [comment, setComment] = useState('');

     const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();

       // Optimistic UI更新
       onAddComment({
         id: 'temp-id',
         content: comment,
         createdAt: new Date().toISOString()
       });

       // コメントをクリア
       setComment('');

       // Server Actionを呼び出し
       const result = await addComment(postId, comment);

       if (!result.success) {
         // エラー処理
         alert(result.error);
       }
     };

     return (
       <form onSubmit={handleSubmit}>
         <textarea
           value={comment}
           onChange={(e) => setComment(e.target.value)}
           placeholder="コメントを入力"
           required
         />
         <button type="submit">送信</button>
       </form>
     );
   }
   ```

3. **バリデーションと再検証パターン**:
   サーバー側でバリデーションを行い、成功時にキャッシュを再検証

   ```typescript
   'use server'

   import { revalidatePath } from 'next/cache'
   import { z } from 'zod'

   // バリデーションスキーマ
   const ProductSchema = z.object({
     name: z.string().min(1, '商品名は必須です'),
     price: z.number().positive('価格は正の数である必要があります'),
     stock: z.number().int().min(0, '在庫は0以上である必要があります'),
   })

   type ProductData = z.infer<typeof ProductSchema>

   interface FormResult {
     success: boolean
     errors?: Record<string, string[]>
   }

   export async function createProduct(formData: FormData): Promise<FormResult> {
     // フォームデータをオブジェクトに変換
     const data = {
       name: formData.get('name') as string,
       price: Number(formData.get('price')),
       stock: Number(formData.get('stock')),
     }

     // バリデーション
     const result = ProductSchema.safeParse(data)

     if (!result.success) {
       return {
         success: false,
         errors: result.error.flatten().fieldErrors,
       }
     }

     // APIリクエスト
     const response = await fetch('https://api.example.com/products', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(result.data),
     })

     if (response.ok) {
       // 商品一覧ページを再検証
       revalidatePath('/products')
       return { success: true }
     } else {
       return {
         success: false,
         errors: { _form: ['商品の登録に失敗しました'] },
       }
     }
   }
   ```

### 6. まとめとベストプラクティス

Next.js App Routerにおけるデータ取得と再検証機能の特徴とユースケース：

1. **fetch options.next.revalidate**

   - 時間ベースの再検証
   - 更新頻度が予測可能なデータに最適
   - 秒単位で設定可能

2. **fetch options.next.tags と revalidateTag**

   - タグベースの再検証
   - 関連するデータを一括で更新
   - データモデル間の関係を表現可能

3. **revalidatePath / revalidateTag**

   - オンデマンド再検証
   - パスベースとタグベースの2種類
   - データ更新時に明示的に呼び出し

4. **Server Actions**
   - サーバーサイド処理のシームレスな統合
   - フォーム処理と再検証の併用
   - 複数の実装パターンが利用可能

#### ユースケース別の機能選択ガイド

- **ブログサイト**:

  - 記事データ: 長めの`revalidate`時間
  - コメント: タグベースの再検証（更新頻度が高い）
  - 管理機能: Server Actionsと`revalidateTag`の組み合わせ

- **ECサイト**:

  - 商品データ: 中程度の`revalidate`時間
  - 価格・在庫: タグベースの再検証
  - 購入フロー: Server Actions

- **ダッシュボード**:
  - リアルタイムデータ: 短い`revalidate`時間
  - ユーザーアクション: Server Actionsと`revalidatePath`

#### パフォーマンスとUXの最適化ポイント

1. **適切なキャッシュ戦略**:

   - データ特性に合わせた再検証期間設定
   - 効率的なタグ付け体系の設計

2. **ユーザー体験の向上**:

   - Optimistic UIの実装
   - 適切なローディング状態表示

3. **サーバーリソースの効率化**:
   - 必要箇所のみの再検証
   - 更新のバッチ処理化

Next.js App Routerのデータ取得と再検証機能は、パフォーマンスとユーザー体験を両立する強力なツール群。適切な組み合わせにより、高速で信頼性の高いアプリケーション構築が可能。

## サンプルコード

### fetch options.next.revalidate の実装例

```typescript
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';

interface BlogPost {
  title: string;
  content: string;
  publishedAt: string;
  author: {
    name: string;
  };
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600 } // 1時間ごとに再検証
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-500 mb-6">
        {new Date(post.publishedAt).toLocaleDateString()} • {post.author.name}
      </div>
      <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### fetch options.next.tags と revalidateTag の実装例

```typescript
// lib/products.ts
interface Product {
  id: string
  name: string
  price: number
  description: string
  categoryId: string
  stock: number
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: {
      tags: ['products', `product-${id}`],
    },
  })

  if (!res.ok) return null
  return res.json()
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const res = await fetch(`https://api.example.com/categories/${categoryId}/products`, {
    next: {
      tags: ['products', `category-${categoryId}`],
    },
  })

  if (!res.ok) return []
  return res.json()
}

// app/admin/actions.ts
;('use server')

import { revalidateTag } from 'next/cache'

interface UpdateResult {
  success: boolean
  error?: string
}

export async function updateProductInventory(id: string, stock: number): Promise<UpdateResult> {
  const response = await fetch(`https://api.example.com/products/${id}/inventory`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock }),
  })

  if (response.ok) {
    // 特定の製品のキャッシュを再検証
    revalidateTag(`product-${id}`)

    // 在庫ゼロになった場合はカテゴリページも更新
    if (stock === 0) {
      const product = (await response.json()) as Product
      revalidateTag(`category-${product.categoryId}`)
    }

    return { success: true }
  } else {
    return { success: false, error: '在庫の更新に失敗しました' }
  }
}
```

### revalidatePath と revalidateTag の実装例

```typescript
// app/dashboard/actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

// パスベースの再検証
export async function refreshDashboardData() {
  // ダッシュボード全体を再検証
  revalidatePath('/dashboard')
  return { success: true }
}

// 特定のセクションを再検証
export async function refreshSalesData() {
  // 売上データセクションのみを再検証
  revalidatePath('/dashboard/sales')
  return { success: true }
}

// タグベースの再検証
export async function refreshUserData(userId: string) {
  // 特定のユーザーに関連するすべてのデータを再検証
  revalidateTag(`user-${userId}`)
  return { success: true }
}

// API Routeでの使用例
// app/api/webhook/route.ts
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const payload = await request.json()

  // ペイロードの検証（シークレットキーなど）
  if (!isValidPayload(payload)) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  // ペイロードのタイプに基づいて適切なタグを再検証
  if (payload.type === 'product.updated') {
    revalidateTag(`product-${payload.productId}`)
    revalidateTag('products')
  } else if (payload.type === 'order.created') {
    revalidateTag(`user-${payload.userId}`)
    revalidateTag('orders')
  }

  return NextResponse.json({ success: true })
}

function isValidPayload(payload: any) {
  // ペイロードの検証ロジック
  return true // 実際には適切な検証を行う
}
```

### Server Actions の実装例

```typescript
// app/posts/[id]/edit/page.tsx
import { getPost } from '@/lib/posts';
import PostForm from './PostForm';

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">記事の編集</h1>
      <PostForm post={post} />
    </div>
  );
}

// app/posts/[id]/edit/PostForm.tsx
'use client';

import { useState } from 'react';
import { updatePost } from './actions';
import { useRouter } from 'next/navigation';

export default function PostForm({ post }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const result = await updatePost(post.id, formData);

    setIsSubmitting(false);

    if (result.success) {
      // 成功時に記事ページにリダイレクト
      router.push(`/posts/${post.id}`);
    } else {
      // エラー表示
      setErrors(result.errors || { _form: ['更新に失敗しました'] });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-1">タイトル</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        {errors.title && (
          <p className="text-red-500 mt-1">{errors.title}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1">本文</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="w-full border p-2 rounded h-64"
          required
        />
        {errors.content && (
          <p className="text-red-500 mt-1">{errors.content}</p>
        )}
      </div>

      {errors._form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors._form.map((error, i) => <p key={i}>{error}</p>)}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? '更新中...' : '更新する'}
      </button>
    </form>
  );
}

// app/posts/[id]/edit/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const PostSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文
```
