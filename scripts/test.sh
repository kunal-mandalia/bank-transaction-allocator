(cd ./packages/background && yarn test)
(cd ./packages/content && yarn test)
(cd ./packages/popup && CI=true yarn test)