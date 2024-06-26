---
slug: route-handlers
title: appDir の Route Handlers を使う・API Routes からの変更点
publishedAt: 2023-04-22
tags: [nextjs]
---

公式ドキュメント  
[Routing: Route Handlers | Next.js](https://beta.nextjs.org/docs/routing/route-handlers)

## tldr

これまで `pages` directory では例えば **`/pages/api/hello.ts`** を作成して以下のように書いていましたが、

```typescript:pages/api/hello.ts
export default function handler(req, res) {
  res.json({ msg: 'Hello world!' });
}
```

`app` directory で同じことをする場合は、**`/app/hello/route.ts`** を作成して以下のように書きます。

```typescript:app/hello/route.ts
export function GET(req) {
  return new Response('Hello world!');
}
```

## 変わったこと

それぞれのインターフェース変更についての細かい意思決定プロセスは全く追っていませんが、ひとまず表面的には以下のような変更があります。

[1. 特定のメソッドに対してのハンドラを named export するようになった](#特定のメソッドに対してのハンドラを-named-export-するようになった)  

[2. ファイルを置く場所が変わった](#ファイルを置く場所が変わった)  

[3. ハンドラの API が変わった](#ハンドラの-api-が変わった)

### 特定のメソッドに対してのハンドラを named export するようになった

これまで全ての HTTP method に default export されたハンドラが割り当てられていましたが、`GET` や `POST` のように特定のメソッドに対してのハンドラを named export するように変更されました。  
[Supported HTTP Methods | Next.js](https://beta.nextjs.org/docs/routing/route-handlers#supported-http-methods)

大抵 (というか全て) API は特定の method のみを想定しているはずなので、これまで実装者は以下のような分岐を書く必要がありました。

```typescript
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(403).json({ error: 'Method not allowed' });
  }
}
```

これを愚直に書いていたか、ある程度共通化していたか、うまいことミドルウェアを噛ませていたかはさておき、単純に嬉しい update かと思います。

### ファイルを置く場所が変わった

[`app` directory 自体の変更](https://beta.nextjs.org/docs/routing/fundamentals)と言えますが、ファイルを置く場所が `/pages/api/**/*.tsx` から、`/app/**/route.tsx` に変わりました。  
例えば `/api/posts` のエンドポイントはこれまで **`/pages/api/posts/index.tsx`** に置いていたファイルは、**`/app/posts/route.tsx`** に置くようになります。

### ハンドラの API が変わった

これまでの `NextApiHandler` は比較的 express like で、`req` と `res` を受け取り、`res.json()` などでレスポンスしていました。  
Route Handlers ではよりローレベル / ブラウザネイティブな API が露出していて、[Fetch API の Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) を受け取り、関数から [Fetch API の Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) を返します。

ただし、より easy に Next.js がラップした便利 `req: NextRequest`、`res: NextResponse` を引き続き使うこともできるそうです。  
[Extended NextRequest and NextResponse APIs | Next.js](https://beta.nextjs.org/docs/routing/route-handlers#extended-nextrequest-and-nextresponse-apis)

以下は Next.js の docs から引用しました。

```typescript
export async function GET(request: NextRequest) {
  const token = request.cookies.get('token');
  const response = NextResponse.next();
  response.cookies.set('token', token);
  return response;
}
```

## 以上です

大体こんな感じでしょうか？
