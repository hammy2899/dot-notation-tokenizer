import { tokenize } from './index'

describe('should throw error when notation starts with invalid character', () => {
  test('starting with .', () => {
    expect(() => tokenize('.test')).toThrow('Invalid character at start of notation')
  })

  test('starting with [', () => {
    expect(() => tokenize('[test')).toThrow('Invalid character at start of notation')
  })

  test('starting with ]', () => {
    expect(() => tokenize(']test')).toThrow('Invalid character at start of notation')
  })

  test('starting with \\', () => {
    expect(() => tokenize('\\test')).toThrow('Invalid character at start of notation')
  })
})

describe('should throw error when property key is empty', () => {
  expect(() => tokenize('test..test')).toThrow('Property key can\'t be empty')
})

describe('should throw error invalid character in or after an array index', () => {
  test('contains invalid character', () => {
    expect(() => tokenize('test[l]')).toThrow('Invalid character in array index')
    expect(() => tokenize('test[.]')).toThrow('Invalid character in array index')
    expect(() => tokenize('test[-]')).toThrow('Invalid character in array index')
    expect(() => tokenize('test[[]')).toThrow('Invalid character in array index')
    expect(() => tokenize('test[\\]')).toThrow('Invalid character in array index')
  })

  test('invalid after index', () => {
    expect(() => tokenize('test[0]]')).toThrow('Invalid character after array index')
    expect(() => tokenize('test[0]a')).toThrow('Invalid character after array index')
    expect(() => tokenize('test[0]0')).toThrow('Invalid character after array index')
    expect(() => tokenize('test[0]#')).toThrow('Invalid character after array index')
    expect(() => tokenize('test[0]\\')).toThrow('Invalid character after array index')
  })
})

describe('should return array of property key tokens', () => {
  test('"test.test.test" should return array of 3 "test" KEY tokens', () => {
    const notation = 'test.test.test'
    const result = tokenize(notation)

    expect(result).toHaveLength(3)
    expect(result[0].kind).toBe('KEY')
    expect(result[1].kind).toBe('KEY')
    expect(result[2].kind).toBe('KEY')
  })

  test('should correctly handle escaped tokens', () => {
    const notation = 'test\\.test.test\\[0]test.test'
    const result = tokenize(notation)

    expect(result).toHaveLength(3)
    expect(result[0].value).toBe('test\\.test')
    expect(result[1].value).toBe('test\\[0]test')
    expect(result[2].value).toBe('test')
  })
})

describe('should return array index tokens', () => {
  test('"test.test[0]" should return an array index', () => {
    const notation = 'test.test[0]'
    const result = tokenize(notation)

    expect(result).toHaveLength(3)
    expect(result[0].kind).toBe('KEY')
    expect(result[1].kind).toBe('KEY')

    expect(result[2].kind).toBe('ARRAY_INDEX')
    expect(result[2].value).toBe(0)
  })

  test('should handle deep arrays correctly', () => {
    const notation = 'test.test[0][1][2]'
    const result = tokenize(notation)

    expect(result).toHaveLength(5)
    expect(result[0].kind).toBe('KEY')
    expect(result[1].kind).toBe('KEY')

    expect(result[2].kind).toBe('ARRAY_INDEX')
    expect(result[2].value).toBe(0)

    expect(result[3].kind).toBe('ARRAY_INDEX')
    expect(result[3].value).toBe(1)

    expect(result[4].kind).toBe('ARRAY_INDEX')
    expect(result[4].value).toBe(2)
  })
})

describe('should throw error when array index is not closed', () => {
  expect(() => tokenize('test.test[0')).toThrow('Array index was not closed')
})

describe('should be able to enter array index objects', () => {
  test('"test[0].test.test" should return 2 property key tokens after the array index', () => {
    const notation = 'test[0].test.test'
    const result = tokenize(notation)

    expect(result).toHaveLength(4)
    expect(result[0].kind).toBe('KEY')
    expect(result[1].kind).toBe('ARRAY_INDEX')
    expect(result[2].kind).toBe('KEY')
    expect(result[3].kind).toBe('KEY')
  })
})

describe('should throw error when using forbidden keys', () => {
  expect(() => tokenize('test.prototype')).toThrow('Forbidden property within notation')
  expect(() => tokenize('test.constructor')).toThrow('Forbidden property within notation')
  expect(() => tokenize('test.__proto__')).toThrow('Forbidden property within notation')

  expect(() => tokenize('prototype.test')).toThrow('Forbidden property within notation')
  expect(() => tokenize('constructor.test')).toThrow('Forbidden property within notation')
  expect(() => tokenize('__proto__.test')).toThrow('Forbidden property within notation')

  expect(() => tokenize('prototype[0].test')).toThrow('Forbidden property within notation')
  expect(() => tokenize('constructor[0].test')).toThrow('Forbidden property within notation')
  expect(() => tokenize('__proto__[0].test')).toThrow('Forbidden property within notation')
})

describe('', () => {
  test('', () => {
  })
})
