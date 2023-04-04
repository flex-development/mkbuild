/**
 * @file CLI Providers - UtilityService
 * @module mkbuild/cli/providers/UtilityService
 */

import { Injectable } from '@nestjs/common'
import { CliUtilityService } from 'nest-commander'

/**
 * CLI utilities provider.
 *
 * @class
 * @extends {CliUtilityService}
 */
@Injectable()
class UtilityService extends CliUtilityService {
  /**
   * Converts the given `list` into a {@linkcode Set}.
   *
   * @public
   *
   * @template T - List item type
   *
   * @param {string} list - List to evaluate
   * @param {string} [delimiter=','] - List separator
   * @return {Set<T>} `list` as {@linkcode Set}
   */
  public parseList<T extends string = string>(
    list: string,
    delimiter: string = ','
  ): Set<T> {
    return list.includes(delimiter)
      ? new Set<T>(list.split(delimiter).map(item => item.trim()) as T[])
      : new Set<T>([list.trim()] as T[])
  }

  /**
   * Helper for casting the given `string` to a more complex string type.
   *
   * @public
   *
   * @template T - Complex string type
   *
   * @param {string} string - String to evaluate
   * @return {T} `string` as `T`
   */
  public parseString<T extends string = string>(string: string): T {
    return string as T
  }
}

export default UtilityService
