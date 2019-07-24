(cd ./app/background && yarn test)
(cd ./app/content && yarn test)
(cd ./app/popup && CI=true yarn test)