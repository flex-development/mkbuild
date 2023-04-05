/**
 * @file CLI Providers - UtilityService
 * @module mkbuild/cli/providers/UtilityService
 */

import type { JsonPrimitive } from '@flex-development/tutils'
import { Injectable } from '@nestjs/common'
import { CliUtilityService } from 'nest-commander'
import { objectify } from 'radash'

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
      ? new Set<T>(val.split(delimiter).map(item => item.trim()) as T[])
      : new Set<T>([val.trim()] as T[])
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
  >(val: string): Record<K, V> {
    /**
     * Regular expression matching a key/value pair list.
     *
     * @const {RegExp} regex
     */
    const regex: RegExp =
      /(?:^|(?:(?<!^),))(?<pair>(?<key>[^,].+?):(?<value>(?:.+?(?=,(?=.+?:)))|(?:.+?(?=,?$))))/gs

    // convert key/pair list into object
    return objectify<[string, string], K, V>(
      [...val.matchAll(regex)].map(([, , key, value]) => [key!.trim(), value!]),
      ([key]: [string, string]): K => this.parseString<K>(key),
      ([, value]: [string, string]): V => {
        try {
          return JSON.parse(value) as V
        } catch {
          return value as V
        }
      }
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

  /**
   * Helper for casting the given string value to a more complex string type.
   *
   * @public
   *
   * @template T - Complex string type
   *
   * @param {string} val - String to evaluate
   * @return {T} `val` as `T`
   */
  public parseString<T extends string = string>(val: string): T {
    return val as T
  }
}

export default UtilityService
