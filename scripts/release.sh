#!/bin/sh

# Local Release Workflow
#
# 1. run typecheck
# 2. run tests
# 3. pack project
# 4. run postbuild typecheck
# 5. analyze types
# 6. print package size report
# 7. get new package version
# 8. get release branch name
# 9. switch to release branch
# 10. stage changes
# 11. commit changes
# 12. push release branch to origin
# 13. create pull request
# 14. cleanup
#
# References:
#
# - https://cli.github.com/manual/gh_pr_create
# - https://github.com/arethetypeswrong/arethetypeswrong.github.io

yarn typecheck
yarn test:cov
yarn pack
yarn check:types:build
attw package.tgz
yarn pkg-size
VERSION=$(jq .version package.json -r)
RELEASE_BRANCH=release/$VERSION
git switch -c $RELEASE_BRANCH
git add .
git commit -s -m "release: $(jq .tagPrefix package.json -r)$VERSION"
git push origin -u --no-verify $RELEASE_BRANCH
gh pr create --assignee @me --label scope:release --web
yarn clean:pack
