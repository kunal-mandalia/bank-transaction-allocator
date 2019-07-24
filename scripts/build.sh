#!/bin/bash

rm -rf build
rm -rf dist
mkdir dist

(cd ./app/background && tsc)
(cd ./app/content && tsc)
(cd ./app/popup && yarn build && mv ./build ../../build/popup)
(cp ./app/manifest.json ./build/manifest.json)

version="$(git rev-parse HEAD | head -c 7)"
(zip -r app.zip ./build && mv app.zip ./dist/app-artifact.${version}.zip)