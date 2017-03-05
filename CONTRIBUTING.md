# Contributing

BaberuTVでは不具合の報告や機能要望は常に歓迎しています。

[Issues](https://github.com/baberutv/baberutv/issues)に重複するものがないかを確認した上でIssueの作成をしてください。開発の進行状況については[Projects](https://github.com/baberutv/baberutv/projects/1)で管理しています。あわせてご確認ください。

## 開発環境構築

### ソースコードの取得

ソースコードは[GitHub](https://github.com/baberutv/baberutv)で管理されています。[Git](https://git-scm.com/)を使ってリポジトリーからコードの取得を行ってください。

```shell
$ git clone https://github.com/baberutv/baberutv.git
$ cd ./baberutv
```

### Docker Composeを使う

開発環境の構築には[Docker Compose](https://docs.docker.com/compose/)を使うことを強く推奨します。[Docker](https://www.docker.com/)とDocker Composeがインストールされていれば、あとはインターネット環境さえあれば既存の環境に大きな影響を与えずに開発環境の構築が行えます。

```shell
$ docker-compose up
```

というコマンドを実行すると`8080`版ポートで[`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/)が起動します。

`webpack-dev-server`が起動している状態でコードに変更を加えると、変更が反映された上でウェブブラウザーで開かれている場合は、そちらでも自動的に更新がされます。

### Docker Composeを使わない場合

CPUが対応していないといった理由でDockerが使えないかたもいるでしょう。必須なのは[Node.js](https://nodejs.org/ja/)と[Yarn](https://yarnpkg.com/en/)のふたつだけです。これらのものがインストールされている環境であればGNU/LinuxやmacOS、Windows、そのほかの環境であっても開発が行えるようになっているはずです。

```shell
$ yarn
$ yarn dev
```

一度 開発用のサーバーを起動させるとDocker Composeを使う場合と同じく、コードに変更がある度に自動でサーバーの再起動がされます。

## コードフォーマット

コードのフォーマットの確認には[ESLint](http://eslint.org/)を使っています。

```shell
$ docker-compose run --rm webpack yarn lint
```

というコマンドを実行することによって、コードフォーマットに正しく従えているかどうかを確認できます。

## テスト

```shell
$ docker-compose run --rm webpack yarn test-only
```

というコマンドを実行することによって自動テストが実行されます。テスト自体は[`./__tests__`](/__tests__)以下にありますが、現時点ではほとんど書かれていません。今後充実させていくというのが課題となっています。

## Pull Request

[Pull Request](https://github.com/baberutv/baberutv/pulls)についてはあらかじめIssueの作成を行ってからにしてもらえると助かります。これは作業の無用な競合が起こってしまわないようにしたいためです。ただし小さな誤入力などの修正といった細かな修正についてはわざわざIssueを作らずに直接Pull Requestを作るような形でも問題ありません。
