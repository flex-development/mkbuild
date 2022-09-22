/**
 * @file Test Setup - chai
 * @module tests/setup/chai
 * @see https://chaijs.com
 */

import chai from 'chai'
import chaiQuantifiers from 'chai-quantifiers'

// configure chai
chai.config.includeStack = true
chai.config.truncateThreshold = 0

/**
 * initialize chai plugins.
 *
 * @see https://github.com/funny-bytes/chai-quantifiers
 */
chai.use(chaiQuantifiers)
