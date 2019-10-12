(cd ./packages/background && yarn test --passWithNoTests)
(cd ./packages/content && yarn test --passWithNoTests)
(cd ./packages/popup && CI=true yarn test --passWithNoTests)