/**
 * @file Unit Tests - IGNORE_PATTERNS
 * @module mkbuild/utils/tests/unit/IGNORE_PATTERNS
 */

import TEST_SUBJECT from '../ignore-patterns'

describe('unit:utils/IGNORE_PATTERNS', () => {
  it('should be an instance of Set', () => {
    expect(TEST_SUBJECT).to.be.instanceof(Set)
  })

  it('should contain 23 patterns', () => {
    expect(TEST_SUBJECT.size).to.equal(23)
  })

  it('should contain "**/*.mdx"', () => {
    expect(TEST_SUBJECT.has('**/*.mdx')).to.be.true
  })

  it('should contain "**/*.stories.*"', () => {
    expect(TEST_SUBJECT.has('**/*.stories.*')).to.be.true
  })

  it('should contain "**/.*ignore"', () => {
    expect(TEST_SUBJECT.has('**/.*ignore')).to.be.true
  })

  it('should contain "**/.*rc"', () => {
    expect(TEST_SUBJECT.has('**/.*rc')).to.be.true
  })

  it('should contain "**/.*rc.*"', () => {
    expect(TEST_SUBJECT.has('**/.*rc.*')).to.be.true
  })

  it('should contain "**/.DS_*"', () => {
    expect(TEST_SUBJECT.has('**/.DS_*')).to.be.true
  })

  it('should contain "**/.codecov.yml"', () => {
    expect(TEST_SUBJECT.has('**/.codecov.yml')).to.be.true
  })

  it('should contain "**/.cspell.json"', () => {
    expect(TEST_SUBJECT.has('**/.cspell.json')).to.be.true
  })

  it('should contain "**/.dictionary.txt"', () => {
    expect(TEST_SUBJECT.has('**/.dictionary.txt')).to.be.true
  })

  it('should contain "**/.editorconfig"', () => {
    expect(TEST_SUBJECT.has('**/.editorconfig')).to.be.true
  })

  it('should contain "**/.env*"', () => {
    expect(TEST_SUBJECT.has('**/.env*')).to.be.true
  })

  it('should contain "**/.git*"', () => {
    expect(TEST_SUBJECT.has('**/.git*')).to.be.true
  })

  it('should contain "**/Brewfile"', () => {
    expect(TEST_SUBJECT.has('**/Brewfile')).to.be.true
  })

  it('should contain "**/__mocks__"', () => {
    expect(TEST_SUBJECT.has('**/__mocks__')).to.be.true
  })

  it('should contain "**/__snapshots__"', () => {
    expect(TEST_SUBJECT.has('**/__snapshots__')).to.be.true
  })

  it('should contain "**/__tests__"', () => {
    expect(TEST_SUBJECT.has('**/__tests__')).to.be.true
  })

  it('should contain "**/build.config.*"', () => {
    expect(TEST_SUBJECT.has('**/build.config.*')).to.be.true
  })

  it('should contain "**/package-lock.json"', () => {
    expect(TEST_SUBJECT.has('**/package-lock.json')).to.be.true
  })

  it('should contain "**/package.json"', () => {
    expect(TEST_SUBJECT.has('**/package.json')).to.be.true
  })

  it('should contain "**/tsconfig*.json"', () => {
    expect(TEST_SUBJECT.has('**/tsconfig*.json')).to.be.true
  })

  it('should contain "**/vitest-env.*"', () => {
    expect(TEST_SUBJECT.has('**/vitest-env.*')).to.be.true
  })

  it('should contain "**/vitest.config.*"', () => {
    expect(TEST_SUBJECT.has('**/vitest.config.*')).to.be.true
  })

  it('should contain "**/yarn.lock"', () => {
    expect(TEST_SUBJECT.has('**/yarn.lock')).to.be.true
  })
})
