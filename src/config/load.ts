/**
 * @file Config - loadBuildConfig
 * @module mkbuild/config/loadBuildConfig
 */

import type { Config } from '#src/interfaces'
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
 * @param {string} [location] - Directory to search
 * @return {Config} Build configuration options
 */
const loadBuildConfig = async (location: string): Promise<Config> => {
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
    stopDir: location
  })

  return ((await search(location))?.config as Config | null) ?? {}
}

export default loadBuildConfig
