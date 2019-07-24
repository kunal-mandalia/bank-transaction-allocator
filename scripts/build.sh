#!/bin/bash

rm -rf build
mkdir -p build/artifact

(cd ./app/background && yarn build && mv ./build ../../build/background)
(cd ./app/content && yarn build && mv ./build ../../build/content)
(cd ./app/popup && yarn build && mv ./build ../../build/popup)
(cp ./app/manifest.json ./build/manifest.json)

version="$(git rev-parse HEAD | head -c 7)"
(zip -r app.zip ./build && mv app.zip ./build/artifact/bank-transaction-allocator.${version}.zip)