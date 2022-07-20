import { notationFromTokens, tokenize, isNotationToken } from './index'

describe('should throw type error when argument is incorrect', () => {
  test('should throw error when argument is not a string', () => {
    expect(() => tokenize(1 as any)).toThrow('Notation argument must be a string')
  })

  test('should throw error when argument is an empty string', () => {
    expect(() => tokenize('')).toThrow('Notation argument can\'t be an empty string')
  })
})

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
  test('should throw error when property key is empty', () => {
    expect(() => tokenize('test..test')).toThrow('Property keys can\'t be empty')
  })
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
  test('"test.test.test" should return array of 3 "test" PROPERTY tokens', () => {
    const notation = 'test.test.test'
    const result = tokenize(notation)

    expect(result).toHaveLength(3)
    expect(result[0].kind).toBe('PROPERTY')
    expect(result[1].kind).toBe('PROPERTY')
    expect(result[2].kind).toBe('PROPERTY')
  })

  test('should correctly handle escaped tokens', () => {
    const notation = 'test\\.test.test\\[0]test.test'
    const result: any[] = tokenize(notation)

    expect(result).toHaveLength(3)

    expect(result[0].value).toBe('test.test')
    expect(result[0].raw).toBe('test\\.test')

    expect(result[1].value).toBe('test[0]test')
    expect(result[1].raw).toBe('test\\[0]test')

    expect(result[2].value).toBe('test')
    expect(result[2].raw).toBe('test')
  })
})

describe('should return array index tokens', () => {
  test('"test.test[0]" should return an array index', () => {
    const notation = 'test.test[0]'
    const result = tokenize(notation)

    expect(result).toHaveLength(3)
    expect(result[0].kind).toBe('PROPERTY')
    expect(result[1].kind).toBe('PROPERTY')

    expect(result[2].kind).toBe('ARRAY_INDEX')
    expect(result[2].value).toBe(0)
  })

  test('should handle deep arrays correctly', () => {
    const notation = 'test.test[0][1][2]'
    const result = tokenize(notation)

    expect(result).toHaveLength(5)
    expect(result[0].kind).toBe('PROPERTY')
    expect(result[1].kind).toBe('PROPERTY')

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
    expect(result[0].kind).toBe('PROPERTY')
    expect(result[1].kind).toBe('ARRAY_INDEX')
    expect(result[2].kind).toBe('PROPERTY')
    expect(result[3].kind).toBe('PROPERTY')
  })
})

describe('notationFromTokens should return the correct notation string', () => {
  test('should return correct properties', () => {
    const notation = 'test1.test2.test3'
    const tokens = tokenize(notation)
    const result = notationFromTokens(tokens)

    expect(result).toBe('test1.test2.test3')
  })

  test('should return array indexes correctly', () => {
    const notation = 'test[0].test'
    const tokens = tokenize(notation)
    const result = notationFromTokens(tokens)

    expect(result).toBe('test[0].test')
  })

  test('should handle escaped characters', () => {
    const notation = 'test\\.test.testing\\[0\\]'
    const tokens = tokenize(notation)
    const result = notationFromTokens(tokens)

    expect(result).toBe('test\\.test.testing\\[0\\]')
  })

  test('should return array indexes correctly', () => {
    const notation = 'test[0].test'
    const tokens = tokenize(notation)
    const result = notationFromTokens(tokens)

    expect(result).toBe('test[0].test')
  })
})

describe('notationFromTokens should throw error for invalid arguments', () => {
  test('throw if argument is not array of tokens', () => {
    const token: any = {
      kind: 'PROPERTY',
      value: 'test',
      raw: 'test',
      index: { start: 0, end: 4 }
    }

    expect(() => notationFromTokens('' as any)).toThrow('Tokens must be an array of notation tokens')
    expect(() => notationFromTokens([] as any)).toThrow('Tokens must be an array of notation tokens')
    expect(() => notationFromTokens([{}, {}] as any)).toThrow('Tokens must be an array of notation tokens')
    expect(() => notationFromTokens([token, {}] as any)).toThrow('Tokens must be an array of notation tokens')
  })
})

describe('isNotationToken should return true when a token is valid', () => {
  test('should check all properties for the kind of token', () => {
    const propToken: any = {
      kind: 'PROPERTY',
      value: 'test',
      raw: 'test',
      index: {
        start: 0,
        end: 4
      }
    }

    expect(isNotationToken(propToken)).toBe(true)

    propToken.kind = 'unknown'
    expect(isNotationToken(propToken)).toBe(false)
    propToken.kind = 'PROPERTY'

    delete propToken.value
    expect(isNotationToken(propToken)).toBe(false)
    propToken.value = 'test'

    propToken.value = 2
    expect(isNotationToken(propToken)).toBe(false)
    propToken.value = 'test'

    propToken.raw = 2
    expect(isNotationToken(propToken)).toBe(false)
    propToken.raw = 'test'

    delete propToken.raw
    expect(isNotationToken(propToken)).toBe(false)
    propToken.raw = 'test'

    propToken.text = 'test'
    expect(isNotationToken(propToken)).toBe(false)
    delete propToken.text

    delete propToken.index
    expect(isNotationToken(propToken)).toBe(false)
    propToken.index = { start: 0, end: 4 }

    delete propToken.index.start
    expect(isNotationToken(propToken)).toBe(false)
    propToken.index = { start: 0, end: 4 }

    delete propToken.index.end
    expect(isNotationToken(propToken)).toBe(false)
    propToken.index = { start: 0, end: 4 }

    propToken.index.start = 'test'
    expect(isNotationToken(propToken)).toBe(false)
    propToken.index = { start: 0, end: 4 }

    propToken.index.end = 'test'
    expect(isNotationToken(propToken)).toBe(false)
    propToken.index = { start: 0, end: 4 }

    const arrayToken: any = {
      kind: 'ARRAY_INDEX',
      value: 1,
      text: '[1]',
      index: {
        start: 0,
        end: 3
      }
    }

    expect(isNotationToken(arrayToken)).toBe(true)

    arrayToken.kind = 'unknown'
    expect(isNotationToken(arrayToken)).toBe(false)
    arrayToken.kind = 'ARRAY_INDEX'

    arrayToken.value = '1'
    expect(isNotationToken(arrayToken)).toBe(false)
    arrayToken.value = 0

    delete arrayToken.value
    expect(isNotationToken(arrayToken)).toBe(false)
    arrayToken.value = 0

    arrayToken.raw = 'test'
    expect(isNotationToken(arrayToken)).toBe(false)
    delete arrayToken.raw

    arrayToken.text = 'test'
    expect(isNotationToken(arrayToken)).toBe(false)
    arrayToken.text = '[0]'

    arrayToken.text = 1
    expect(isNotationToken(arrayToken)).toBe(false)
    arrayToken.text = '[0]'

    delete arrayToken.text
    expect(isNotationToken(arrayToken)).toBe(false)
    arrayToken.text = '[0]'

    arrayToken.text = '0]'
    expect(isNotationToken(arrayToken)).toBe(false)
    arrayToken.text = '[0]'

    arrayToken.text = '[0'
    expect(isNotationToken(arrayToken)).toBe(false)
    arrayToken.text = '[0]'

    arrayToken.text = '[1]'
    expect(isNotationToken(arrayToken)).toBe(false)
    arrayToken.text = '[0]'
  })
})
