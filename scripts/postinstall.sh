#!/bin/sh

# Post Install Workflow
#
# References:
#
# - https://github.com/ds300/patch-package
# - https://typicode.github.io/husky

if [ -f node_modules/.bin/husky ]; then
  chmod +x .husky/* && husky install
else
  patch-package
fi
