/**
 * @file Unit Tests - regex
 * @module mkbuild/internal/tests/unit/regex
 */

import pathe from '@flex-development/pathe'
import TestSubject from '../regex'

describe('unit:internal/regex', () => {
  describe('dts', () => {
    describe('.d.cts', () => {
      it('should match file extension ".d.cts"', () => {
        expect(TestSubject.dts.test('.d.cts')).to.be.true
      })

      it('should match module id with file extension ".d.cts"', () => {
        expect(TestSubject.dts.test(pathe.resolve('index.d.cts'))).to.be.true
      })
    })

    describe('.d.mts', () => {
      it('should match file extension ".d.mts"', () => {
        expect(TestSubject.dts.test('.d.mts')).to.be.true
      })

      it('should match module id with file extension ".d.mts"', () => {
        // Arrange

        expect(TestSubject.dts.test(pathe.resolve('index.d.mts'))).to.be.true
      })
    })

    describe('.d.ts', () => {
      it('should match file extension ".d.ts"', () => {
        expect(TestSubject.dts.test('.d.ts')).to.be.true
      })

      it('should match module id with file extension ".d.ts"', () => {
        expect(TestSubject.dts.test(pathe.resolve('index.d.ts'))).to.be.true
      })
    })
  })

  describe('js', () => {
    describe('.cjs', () => {
      it('should match file extension ".cjs"', () => {
        expect(TestSubject.js.test('.cjs')).to.be.true
      })

      it('should match module id with file extension ".cjs"', () => {
        expect(TestSubject.js.test(pathe.resolve('index.cjs'))).to.be.true
      })
    })

    describe('.js', () => {
      it('should match file extension ".js"', () => {
        expect(TestSubject.js.test('.js')).to.be.true
      })

      it('should match module id with file extension ".js"', () => {
        expect(TestSubject.js.test(pathe.resolve('index.js'))).to.be.true
      })
    })

    describe('.jsx', () => {
      it('should match file extension ".jsx"', () => {
        expect(TestSubject.js.test('.jsx')).to.be.true
      })

      it('should match module id with file extension ".jsx"', () => {
        expect(TestSubject.js.test(pathe.resolve('index.jsx'))).to.be.true
      })
    })

    describe('.mjs', () => {
      it('should match file extension ".mjs"', () => {
        expect(TestSubject.js.test('.mjs')).to.be.true
      })

      it('should match module id with file extension ".mjs"', () => {
        expect(TestSubject.js.test(pathe.resolve('index.mjs'))).to.be.true
      })
    })
  })

  describe('ts', () => {
    describe('.cts', () => {
      it('should match file extension ".cts"', () => {
        expect(TestSubject.ts.test('.cts')).to.be.true
      })

      it('should match module id with file extension ".cts"', () => {
        expect(TestSubject.ts.test(pathe.resolve('src/index.cts'))).to.be.true
      })
    })

    describe('.mts', () => {
      it('should match file extension ".mts"', () => {
        expect(TestSubject.ts.test('.mts')).to.be.true
      })

      it('should match module id with file extension ".mts"', () => {
        expect(TestSubject.ts.test(pathe.resolve('src/index.mts'))).to.be.true
      })
    })

    describe('.ts', () => {
      it('should match file extension ".ts"', () => {
        expect(TestSubject.ts.test('.ts')).to.be.true
      })

      it('should match module id with file extension ".ts"', () => {
        expect(TestSubject.ts.test(pathe.resolve('src/index.ts'))).to.be.true
      })
    })

    describe('.tsx', () => {
      it('should match file extension ".tsx"', () => {
        expect(TestSubject.ts.test('.tsx')).to.be.true
      })

      it('should match module id with file extension ".tsx"', () => {
        expect(TestSubject.ts.test(pathe.resolve('src/index.tsx'))).to.be.true
      })
    })
  })
})
