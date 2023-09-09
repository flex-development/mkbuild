/**
 * @file Models - Grammar
 * @module grease/models/Grammar
 */

/**
 * Data model encapsulating changelog grammar.
 *
 * @class
 */
class Grammar {
  /**
   * Regular expression matching fields in a raw commit.
   *
   * @public
   *
   * @return {RegExp} Git log field regex
   */
  public get field(): RegExp {
    return /^-(?<field>.*?)-(?=\n*)$/m
  }

  /**
   * Regular expression matching a commit header.
   *
   * @see https://regex101.com/r/WAJeLp
   *
   * @public
   *
   * @return {RegExp} Commit header regex
   */
  public get header(): RegExp {
    return /^(?<type>[a-z]+)(?:\((?<scope>[a-z-]+)\))?(?<breaking>!)?: +(?<subject>(?:.+ \(#(?<pr>\d+)\))|.+)/i
  }

  /**
   * Regular expression matching mentions (e.g. `@unicornware`) in a raw commit.
   *
   * @see https://regex101.com/r/upbRpj
   *
   * @public
   *
   * @return {RegExp} Mention regex
   */
  public get mention(): RegExp {
    return /\B(?<mention>@(?<user>[\w-]{1,38}(?=[^\w-]\B|\s)))/g
  }

  /**
   * Regular expression matching issue references in commit bodies.
   *
   * @see https://regex101.com/r/Thsp1M
   *
   * @public
   *
   * @return {RegExp} Issue reference regex
   */
  public get reference(): RegExp {
    return /(?:(?:(?<action>(?:close|resolve)[ds]?|fix(?:e[ds])?|releases) +)|(?<repository>(?<owner>[\da-z](?:-(?=[\da-z])|[\da-z]){0,38}(?<=[\da-z]))\/(?<repo>\S+)))?(?<ref>(?<prefix>#|gh-)(?<number>\d+))/gi
  }

  /**
   * Regular expression matching components of a git trailer.
   *
   * @see https://git-scm.com/docs/git-interpret-trailers
   * @see https://regex101.com/r/I56Kgg
   *
   * @return {RegExp} Git trailer components regex
   */
  public get trailer(): RegExp {
    return /(?<token>^.+?(?=:)): (?<value>.+?(?=\n*$))/gs
  }
}

export default Grammar
