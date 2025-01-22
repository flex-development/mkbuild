/**
 * @file Test Setup - chai
 * @module tests/setup/chai
 * @see https://chaijs.com
 */

import chaiEach from '#tests/plugins/chai-each'
import chaiPathe from '#tests/plugins/chai-pathe'
import chaiString from 'chai-string'
import { chai } from 'vitest'

/**
 * initialize chai plugins.
 */
chai.use(chaiEach)
chai.use(chaiPathe)
chai.use(chaiString)
