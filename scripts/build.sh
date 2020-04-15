#!/bin/bash

rm -rf build
mkdir -p build/artifact

(cd ./packages/common && yarn build)
(cd ./packages/background && yarn build && cp -r ./build ../../build/background)
(cd ./packages/content && yarn build && cp -r ./build ../../build/content)
(cd ./packages/popup && yarn build && cp -r ./build ../../build/popup)
(cp ./manifest.json ./build/manifest.json)

version="$(git rev-parse HEAD | head -c 7)"
(zip -r app.zip ./build && mv app.zip ./build/artifact/bank-transaction-allocator.${version}.zip)