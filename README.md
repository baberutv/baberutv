# BaberuTV [![(build status)](https://circleci.com/gh/baberutv/baberutv.svg?style=shield)](https://circleci.com/gh/baberutv/baberutv/tree/master) [![coverage status](https://coveralls.io/repos/github/baberutv/baberutv/badge.svg?branch=master)](https://coveralls.io/github/baberutv/baberutv?branch=master)

BaberuTVはTVです。TVとはつまりTelevisionの略です。つまり遠隔の映像を受信して流す機器を指します。BaberuTVではウェブブラウザーを用いて、どのような環境からでも別の場所に存在する動画の再生を行えるアプリケーションです。

## 対応しているウェブブラウザー

- Google Chrome
- Firefox
- Safari
- Microsoft Edge

対応コストの都合上、いずれも最新のバージョンでしか動作の検証を行っていません。少しでも古い環境では動作しいおそれがありますが、その点はご容赦ください。

## 使いかた

Dockerがインストールされている環境であれば、どのような環境でも動作します。

```shell
$ docker build -t baberutv
$ docker run -d -p 8080:8080 baberutv
$ open http://localhost:8080/
```

また[`baberu.tv`](https://baberu.tv/)で最新のリリースバージョンのものが公開されています。

「URI」と書かれている欄にHLS形式の動画のURIを入力して、「Play」ボタンを押すと動画の再生が始まります。

## ライセンス

[MIT](LICENSE)
