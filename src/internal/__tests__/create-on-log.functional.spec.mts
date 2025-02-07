/**
 * @file Functional Tests - createOnLog
 * @module mkbuild/internal/tests/functional/createOnLog
 */

import testSubject from '#internal/create-on-log'
import toInputLog from '#internal/to-input-log'
import {
  createLogger,
  type InputLogObject,
  type Logger
} from '@flex-development/log'
import type { Message } from '@flex-development/mkbuild'
import type { LogLevel, RollupLog } from 'rollup'

vi.mock('#internal/to-input-log', async og => ({
  default: vi
    .fn((await og<{ default: typeof toInputLog }>()).default)
    .mockName('toInputLog')
}))

describe('functional:internal/createOnLog', () => {
  describe('onLog', () => {
    let level: LogLevel
    let log: RollupLog
    let logger: Logger

    beforeAll(() => {
      level = 'warn'
      logger = createLogger({ format: { colors: false }, level })

      log = {
        code: 'EMPTY_BUNDLE',
        message: 'Generated an empty chunk: "interfaces/task".',
        names: ['interfaces/task']
      }
    })

    beforeEach(() => {
      vi.spyOn(logger, 'log')
    })

    it('should handle rollup `log`', () => {
      // Arrange
      const messages: Message[] = []
      let input: InputLogObject

      // Act
      testSubject(messages, logger)(level, log)
      input = vi.mocked(toInputLog).mock.results[0]?.value

      // Expect
      expect(messages).to.be.of.length(1)
      expect(messages).to.have.nested.property('0.code', log.code)
      expect(messages).to.have.nested.property('0.level', level)
      expect(messages).to.have.nested.property('0.message', log.message)
      expect(toInputLog).toHaveBeenCalledOnce()
      expect(logger.log).toHaveBeenCalledExactlyOnceWith(input)
    })
  })
})
