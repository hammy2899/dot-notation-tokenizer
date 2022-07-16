import type { NotationTokens, TokenizerParts } from './types'

const FORBIDDEN_KEYS = [
  'prototype',
  'constructor',
  '__proto__'
]

const FORBIDDEN_START_CHARACTERS = [
  '.',
  '[',
  ']',
  '\\'
]

const VALID_INDEX_CHARACTERS = '1234567890'.split('')

export const tokenize = (notation: string): NotationTokens => {
  const notationTokens: NotationTokens = []
  const chars = notation.split('')

  let current: string = ''
  let part: TokenizerParts = 'START'
  let skipNext = false

  chars.forEach((char, index) => {
    if (part === 'START' && FORBIDDEN_START_CHARACTERS.includes(char)) {
      throw new Error('Invalid character at start of notation')
    }

    if (skipNext) {
      current += char
      part = 'KEY'
      skipNext = false
    } else {
      switch (char) {
        case '\\': {
          if (part === 'ARRAY_INDEX') {
            throw new Error('Invalid character in array index')
          } else if (part === 'ARRAY_INDEX_END') {
            throw new Error('Invalid character after array index')
          }

          current += '\\'
          skipNext = true
          break
        }

        case '.': {
          if (part === 'ARRAY_INDEX') {
            throw new Error('Invalid character in array index')
          } else if (part === 'ARRAY_INDEX_END') {
            part = 'KEY'
            current = ''
            break
          }

          if (current === '') {
            throw new Error('Property key can\'t be empty')
          }

          if (FORBIDDEN_KEYS.includes(current)) {
            throw new Error('Forbidden property within notation')
          }

          notationTokens.push({
            kind: 'KEY',
            value: current,
            index: index - current.length,
            length: current.length
          })
          current = ''
          part = 'KEY'
          break
        }

        case '[': {
          if (part === 'ARRAY_INDEX') {
            throw new Error('Invalid character in array index')
          } else if (part === 'ARRAY_INDEX_END') {
            part = 'ARRAY_INDEX'
            break
          } else if (part === 'KEY') {
            if (FORBIDDEN_KEYS.includes(current)) {
              throw new Error('Forbidden property within notation')
            }

            notationTokens.push({
              kind: 'KEY',
              value: current,
              index: index - current.length,
              length: current.length
            })
            current = ''
          }

          part = 'ARRAY_INDEX'
          break
        }

        case ']': {
          if (part === 'ARRAY_INDEX') {
            notationTokens.push({
              kind: 'ARRAY_INDEX',
              value: Number.parseInt(current, 10),
              index: index - current.length,
              length: current.length
            })
            current = ''
            part = 'ARRAY_INDEX_END'
            break
          } else if (part === 'ARRAY_INDEX_END') {
            throw new Error('Invalid character after array index')
          }

          current += char
          break
        }

        default: {
          if (part === 'ARRAY_INDEX' && !VALID_INDEX_CHARACTERS.includes(char)) {
            throw new Error('Invalid character in array index')
          } else if (part === 'ARRAY_INDEX_END') {
            throw new Error('Invalid character after array index')
          }

          if (part === 'START') {
            part = 'KEY'
          }

          current += char
        }
      }
    }
  })

  switch (part as TokenizerParts) {
    case 'KEY': {
      if (FORBIDDEN_KEYS.includes(current)) {
        throw new Error('Forbidden property within notation')
      }

      notationTokens.push({
        kind: 'KEY',
        value: current,
        index: notation.length - current.length,
        length: current.length
      })
      break
    }

    case 'ARRAY_INDEX': {
      throw new Error('Array index was not closed')
    }

    default: {
      break
    }
  }

  return notationTokens
}
