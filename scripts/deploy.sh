#!/bin/sh

set -e

REPO=$(git config remote.origin.url)

cd $(dirname $0)/..
NODE_ENV=production yarn run build
cd build/public
sed -i'' -e 's/src="\//src=\".\//' index.html
rm -rf .git
git init .
git config user.name 'CicleCI'
git config user.email 'sayhi@circleci.com'
git remote add origin ${REPO}
git checkout -b gh-pages
git add index.html *.js
git commit -am 'add files'
git push -f origin gh-pages
