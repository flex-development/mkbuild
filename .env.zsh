# ENVIRONMENT VARIABLES - ZSH
#
# References:
#
# - https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/dotenv

NODE_NO_WARNINGS=1
NODE_OPTIONS='--es-module-specifier-resolution=node'
PROJECT_CWD=$(node -e "console.log(path.resolve('.'))")
TS_NODE_PROJECT=$PROJECT_CWD/tsconfig.tsnode.json
VITEST_SEGFAULT_RETRY=3
