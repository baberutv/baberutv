# BaberuTV [![(build status)](https://circleci.com/gh/baberutv/baberutv.svg?style=shield)](https://circleci.com/gh/baberutv/baberutv/tree/master) [![coverage status](https://coveralls.io/repos/github/baberutv/baberutv/badge.svg?branch=master)](https://coveralls.io/github/baberutv/baberutv?branch=master)

BaberuTVはTVです。TVとはつまりTelevisionの略です。つまり遠隔の映像を受信して流す機器を指します。BaberuTVではウェブブラウザーを用いて、どのような環境からでも別の場所に存在する動画の再生を行えるアプリケーションです。

## 使いかた

Dockerがインストールされている環境であれば、どのような環境でも動作します。

```shell
$ docker pull baberutv/baberutv:latest
$ docker run -d -p 8080:8080 baberutv:baberutv:latest
$ open http://localhost:8080/
```

また[`https://baberu.tv/`](https://baberu.tv/)で最新のリリースバージョンのものが公開されています。

「URI」と書かれている欄にHLS形式の動画のURIを入力して、「Play」ボタンを押すと動画の再生が始まります。

## 対応しているウェブブラウザー

- [Google Chrome](https://www.google.com/chrome/browser/desktop/)
- [Firefox](https://www.mozilla.org/ja/firefox/new/)
- [Safari](http://www.apple.com/jp/safari/)
- [Microsoft Edge](https://www.microsoft.com/ja-jp/windows/microsoft-edge)

対応コストの都合上、いずれも最新のバージョンでしか動作の検証を行っていません。少しでも古い環境では動作しないおそれがあります。ですが個人開発である都合上そうしたコストをかける余力はなく、対応は難しい状況です。あらかじめご容赦ください。

## コントリビュート

不具合の報告や機能要望がありましたら[行動規範](/CODE_OF_CONDUCT.md)をご確認の上、[コントリビュートガイド](/CONTRIBUTING.md)を参照してください。

## ライセンス

[MIT](LICENSE)
