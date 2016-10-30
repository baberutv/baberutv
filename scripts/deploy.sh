#!/bin/sh -x

set -e

REPO=$(git config remote.origin.url)

cd $(dirname $0)/..
rm -rf build
NODE_ENV=production yarn run build
cd build/public
cp ../../circle.yml .
sed -i'' -e 's/src="\//src=\".\//' index.html
rm -rf .git
git init .
git config user.name 'CicleCI'
git config user.email 'sayhi@circleci.com'
git remote add origin ${REPO}
git checkout -b gh-pages
git add index.html *.js *.js.map circle.yml
git commit -am 'add files'
git push -f origin gh-pages
