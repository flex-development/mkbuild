/**
 * @file CLI Providers - UtilityService
 * @module mkbuild/cli/providers/UtilityService
 */

import {
  cast,
  objectify,
  select,
  split,
  trim,
  type JsonPrimitive
} from '@flex-development/tutils'
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
   * Converts the given list into a {@linkcode Set}.
   *
   * @public
   *
   * @template T - List item type
   *
   * @param {string} val - List to evaluate
   * @param {string} [delimiter=','] - List separator
   * @return {Set<T>} `val` as {@linkcode Set}
   */
  public parseList<T extends string = string>(
    val: string,
    delimiter: string = ','
  ): Set<T> {
    return val.includes(delimiter)
      ? new Set<T>(cast(select(split(val, delimiter), null, trim)))
      : new Set<T>(cast([trim(val)]))
  }

  /**
   * Converts the given list of key/value pairs into a plain object.
   *
   * Pairs are expected to be separated with a colon (`:`).
   *
   * @public
   *
   * @template K - Object key type(s)
   * @template V - Object value type(s)
   *
   * @param {string} val - List to evaluate
   * @return {Record<K, V>} `val` as object
   */
  public parseObject<
    K extends string = string,
    V extends JsonPrimitive = string
  >(val: string): { [H in K]: V } {
    /**
     * Regular expression matching a key/value pair list.
     *
     * @const {RegExp} regex
     */
    const regex: RegExp =
      /(?:^|(?:(?<!^),))(?<pair>(?<key>[^,].+?):(?<value>(?:.+?(?=,(?=.+?:)))|(?:.+?(?=,?$))))/gs

    // convert key/pair list into object
    return cast(
      objectify(
        select([...val.matchAll(regex)], null, ([, , k, v]) => [trim(k!), v!]),
        ([key]): K => cast(key),
        ([, value]): V => {
          try {
            return cast(JSON.parse(cast(value)))
          } catch {
            return cast(value)
          }
        }
      )
    )
  }

  /**
   * Converts the given value into a regular expression.
   *
   * @public
   *
   * @param {string} val - String to evaluate
   * @return {RegExp} `val` as {@linkcode RegExp}
   */
  public parseRegExp(val: string): RegExp {
    const [, pattern = '', flags] = /^\/(.+)\/(.+$)?/.exec(val) ?? []
    return new RegExp(pattern, flags)
  }
}

export default UtilityService
