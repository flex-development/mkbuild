# To-Do

## `0.0.0`

1. Local setup
   - Replace `project-name` with project name (don't forget to skip this line :wink:)
     - Run `yarn` afterwards to update lockfile
   - Commit scopes
     - Update [`.commitlintrc.json`](.commitlintrc.json)
   - Label management
     - Update [`.github/labels.yml`](.github/labels.yml)
   - Package details
     - Update [`package.json#author`](package.json)
     - Update [`package.json#description`](package.json)
     - Update [`package.json#keywords`](package.json)
     - Review [`package.json#publishConfig`](package.json)
   - Preliminary documentation
     - Review [contributing guide](CONTRIBUTING.md)
     - Update project description in [`README`](README.md)
     - Update [project license](LICENSE.md)
       - Sync [`package.json#license`](package.json)
   - Release management
     - Check [`package.json#tagPrefix`](package.json)
   - Review Yarn configuration
     - [`.yarnrc.yml`](.yarnrc.yml)
       - Update [workflow](.github/workflows/) environments and permissions
2. `git setup`
3. `gh repo create flex-development/mkbuild -d="$(jq .description package.json -r)" --push --public -s=.`
4. `gh repo edit --enable-auto-merge --enable-merge-commit=false --enable-wiki=false`
5. Repo Settings
   - General
     - Features
       - Discussions
     - Pull requests
       - Allow squash merging
         - Default to pull request title
       - Always suggest updating pull request branches
       - Do **NOT** automatically delete head branches
   - Code and automation
     - Branches
       - Add branch protection rule matching `main`
         - Protect matching branches
           - Require a pull request before merging
             - Require at least `1` approval
             - Dismiss stale pull request approvals
           - Require status checks to pass before merging
             - Require branches to be up to date before merging
               - GitGuardian Security Checks
               - ci
               - dependabot-auto
           - Require conversation resolution before merging
           - Require signed commits
           - Require linear history
6. Add [@dependabot configuration](https://gist.github.com/unicornware/48a2e88a33301ea3161faa9b548588d7#file-dependabot-yml)
