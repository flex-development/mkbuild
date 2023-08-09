/**
 * @file Config - loadBuildConfig
 * @module mkbuild/config/loadBuildConfig
 */

import type { Config } from '#src/interfaces'
import pathe from '@flex-development/pathe'
import { DOT, cast, get } from '@flex-development/tutils'
import { cosmiconfig } from 'cosmiconfig'
import es from './loader-es'

/**
 * Searches for a build configuration file.
 *
 * If found, a config object will be returned. The object will contain options
 * from the config file. If not found, an empty object will be returned.
 *
 * @see https://github.com/davidtheclark/cosmiconfig#explorersearch
 *
 * @async
 *
 * @param {string} [location=DOT] - Directory to search
 * @return {Config} Build configuration options
 */
const loadBuildConfig = async (location: string = DOT): Promise<Config> => {
  /**
   * Module name.
   *
   * @const {string} name
   */
  const name: string = 'build'

  // get search function
  const { search } = cosmiconfig(name, {
    loaders: { '.cts': es, '.js': es, '.mjs': es, '.mts': es, '.ts': es },
    searchPlaces: [
      '#.config.cjs',
      '#.config.cts',
      '#.config.js',
      '#.config.json',
      '#.config.mjs',
      '#.config.mts',
      '#.config.ts'
    ].map(place => place.replace('#', name)),
    stopDir: pathe.resolve(location)
  })

  return cast(get((await search(location)) ?? undefined, 'config', {}))
}

export default loadBuildConfig
