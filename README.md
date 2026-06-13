# GitHub Profile Card Generator

GitHub のユーザー名からプロフィール情報と公開リポジトリを取得し、カード形式で表示するWebアプリです。

## Features

- GitHubユーザーの検索
- アバター、自己紹介、所属、場所の表示
- フォロワー数、フォロー数、公開リポジトリ数の表示
- スター数上位5件の公開リポジトリを表示
- ローディング表示とエラーハンドリング
- レスポンシブなグラスモーフィズムUI

## Tech Stack

- TypeScript
- HTML
- CSS
- GitHub REST API
- Font Awesome

## How to Run

静的ファイルのみで動作します。リポジトリを clone し、ローカルWebサーバーで `index.html` を開いてください。

```bash
python3 -m http.server 8000
```

ブラウザで `http://localhost:8000` を開き、GitHubのユーザー名を入力します。

## API

認証なしで次のGitHub REST APIを利用しています。

- `GET /users/{username}`
- `GET /users/{username}/repos`

認証なしのAPIレート制限が適用されます。

