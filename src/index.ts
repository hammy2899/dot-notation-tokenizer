import { Tokenizer, Tokens } from './Tokenizer'
import { ErrorMessage } from './errors'
import type { Token } from './types'

export function tokenize (notation: string): Tokens {
  const tokenizer = new Tokenizer()
  return tokenizer.analyze(notation)
}

export function escapeProperty (property: string): string {
  if (typeof property !== 'string') throw new TypeError(ErrorMessage.PROPERTY_ARG_MUST_BE_STRING)
  if (property === '') throw new TypeError(ErrorMessage.PROPERTY_ARG_MUST_BE_STRING)

  return property
    .replaceAll(/(?<!\\)\./g, '\\.')
    .replaceAll(/(?<!\\)\[/g, '\\[')
    .replaceAll(/(?<!\\)\]/g, '\\]')
}

export function unescapeProperty (property: string): string {
  if (typeof property !== 'string') throw new TypeError(ErrorMessage.PROPERTY_ARG_MUST_BE_STRING)
  if (property === '') throw new TypeError(ErrorMessage.PROPERTY_ARG_MUST_BE_STRING)

  return property
    .replaceAll(/\\\./g, '.')
    .replaceAll(/\\\[/g, '[')
    .replaceAll(/\\\]/g, ']')
}

export function tokensFromPropertyKeys (keys: string[]): Tokens {
  if (!Array.isArray(keys)) throw new TypeError(ErrorMessage.KEYS_ARG_MUST_BE_STRINGS)
  if (keys.length === 0) throw new TypeError(ErrorMessage.KEYS_ARG_MUST_BE_STRINGS)
  if (!keys.every(key => typeof key === 'string')) throw new TypeError(ErrorMessage.KEYS_ARG_MUST_BE_STRINGS)
  if (!keys.every(key => key !== '')) throw new TypeError(ErrorMessage.KEYS_ARG_MUST_BE_STRINGS)

  const notation = keys
    .map(key => escapeProperty(key))
    .join('.')

  return tokenize(notation)
}

export function notationFromTokens (tokens: Tokens | Token[]): string {
  if (!Array.isArray(tokens)) throw new TypeError(ErrorMessage.TOKENS_ARG_MUST_BE_TOKENS)
  if (tokens.length === 0) throw new TypeError(ErrorMessage.TOKENS_ARG_MUST_BE_TOKENS)
  if (!tokens.every(token => isNotationToken(token))) throw new TypeError(ErrorMessage.TOKENS_ARG_MUST_BE_TOKENS)

  return tokens.reduce((notation, token, index) => {
    const value: string = token.kind === 'PROPERTY'
      ? token.escaped
      : token.text
    const separator = index === 0
      ? ''
      : token.kind === 'PROPERTY'
        ? '.'
        : ''

    return `${notation}${separator}${value}`
  }, '')
}

export function isNotationToken (token: any): boolean {
  if (token === undefined || token === null || Array.isArray(token) || typeof token !== 'object') return false

  if (!Object.hasOwn(token, 'kind')) return false
  if (!Object.hasOwn(token, 'value')) return false
  if (!Object.hasOwn(token, 'index')) return false
  const index = token.index ?? {}
  if (!Object.hasOwn(index, 'start')) return false
  if (!Object.hasOwn(index, 'end')) return false
  if (typeof index.start !== 'number') return false
  if (typeof index.end !== 'number') return false

  if (token.kind !== 'PROPERTY' && token.kind !== 'ARRAY_INDEX') return false
  if (token.kind === 'PROPERTY' && typeof token.value !== 'string') return false
  if (token.kind === 'PROPERTY' && !Object.hasOwn(token, 'escaped')) return false
  if (token.kind === 'PROPERTY' && typeof token.escaped !== 'string') return false
  if (token.kind === 'PROPERTY' && Object.hasOwn(token, 'text')) return false
  if (token.kind === 'ARRAY_INDEX' && typeof token.value !== 'number') return false
  if (token.kind === 'ARRAY_INDEX' && Object.hasOwn(token, 'escaped')) return false
  if (token.kind === 'ARRAY_INDEX' && !Object.hasOwn(token, 'text')) return false
  if (token.kind === 'ARRAY_INDEX' && typeof token.text !== 'string') return false
  if (token.kind === 'ARRAY_INDEX' && token.text.startsWith('[') === false) return false
  if (token.kind === 'ARRAY_INDEX' && token.text.endsWith(']') === false) return false
  if (token.kind === 'ARRAY_INDEX' && Number.parseInt(token.text.substring(1, token.text.length - 1)) !== token.value) return false

  return true
}

export type { Token, PropertyToken, ArrayIndexToken, TokenKind } from './types'
export { Tokens } from './Tokenizer'
