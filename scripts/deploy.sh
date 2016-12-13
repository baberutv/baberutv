#!/bin/sh -x

set -e

REPO=$(git config remote.origin.url)

cd $(dirname $0)/..
rm -rf build
NODE_ENV=production yarn build
cd build/public
cp ../../circle.yml .
cat <<__EOS | node | tee CNAME
const { parse: parseURL } = require('url');
const { homepage: uri } = require('../../package.json');
const { host } = parseURL(uri);
console.log(host);
__EOS
touch .nojekyll
rm -rf .git
git init .
git config user.name 'CicleCI'
git config user.email 'sayhi@circleci.com'
git remote add origin ${REPO}
git checkout -b gh-pages
git add \
  .nojekyll \
  CNAME \
  404.html \
  circle.yml \
  favicon.ico \
  index.html \
  *.js \
  *.js.map
git commit -am 'add files'
git push -f origin gh-pages
