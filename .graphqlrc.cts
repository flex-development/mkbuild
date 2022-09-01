/**
 * @file GraphQL Config
 * @module config/graphql
 * @see https://graphql-config.com/docs/user/usage
 */

import { config as dotenv } from 'dotenv'
import { expand } from 'dotenv-expand'
import type { IGraphQLConfig } from 'graphql-config'

/**
 * GitHub personal access token.
 *
 * @const {string} GITHUB_TOKEN
 */
const GITHUB_TOKEN: string = ((): string => {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN

  const { parsed: zshenv } = expand({
    parsed: dotenv({ path: '~/.config/zsh/.zshenv' }).parsed
  })

  return zshenv?.GITHUB_TOKEN!
})()

/**
 * GraphQL configuration options.
 *
 * @const {IGraphQLConfig} config
 */
const config: IGraphQLConfig = {
  documents: ['./.github/graphql/**/*.gql'],
  schema: [
    {
      'https://api.github.com/graphql': {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
      }
    }
  ]
}

export default config
