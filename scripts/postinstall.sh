#!/bin/sh

# Post Install Workflow
#
# References:
#
# - https://git-scm.com/docs/git-apply
# - https://typicode.github.io/husky

if [ -f node_modules/.bin/husky ]; then
  chmod +x .husky/* && husky install
else
  git apply --directory=node_modules/globby --reject patches/globby+13.1.2.patch
  git apply --directory=node_modules/mlly --reject patches/mlly+0.5.14.patch
fi
