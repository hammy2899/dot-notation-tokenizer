import { Tokenizer, Tokens } from './Tokenizer'
import { ErrorMessage } from './errors'
import type { Token } from './types'

export function tokenize (notation: string): Tokens {
  const tokenizer = new Tokenizer()
  return tokenizer.analyze(notation)
}

export function notationFromTokens (tokens: Tokens | Token[]): string {
  if (!Array.isArray(tokens)) throw new TypeError(ErrorMessage.TOKENS_ARG_MUST_BE_TOKENS)
  if (!tokens.every(isNotationToken)) throw new TypeError(ErrorMessage.TOKENS_ARG_MUST_BE_TOKENS)

  return tokens.reduce((notation, token, index) => {
    if (token.kind === 'PROPERTY') {
      if (index === 0) {
        return token.value
          .replaceAll('.', '\\.')
          .replaceAll('[', '\\[')
          .replaceAll(']', '\\]')
      }
      return `${notation}.${token.value}`
    } else if (token.kind === 'ARRAY_INDEX') {
      return `${notation}[${token.value}]`
    }
    return ''
  }, '')
}

export function isNotationToken (token: any): boolean {
  if (Object.hasOwn(token, 'kind') === false) return false
  if (Object.hasOwn(token, 'value') === false) return false
  if (Object.hasOwn(token, 'index') === false) return false
  const index = token.index
  if (Object.hasOwn(index, 'start') === false) return false
  if (Object.hasOwn(index, 'end') === false) return false
  if (typeof index.start !== 'number') return false
  if (typeof index.end !== 'number') return false

  if (token.kind !== 'PROPERTY' && token.kind !== 'ARRAY_INDEX') return false
  if (token.kind === 'PROPERTY' && typeof token.value !== 'string') return false
  if (token.kind === 'PROPERTY' && Object.hasOwn(token, 'text') === true) return false
  if (token.kind === 'ARRAY_INDEX' && typeof token.value !== 'number') return false
  if (token.kind === 'ARRAY_INDEX' && Object.hasOwn(token, 'text') === false) return false
  if (token.kind === 'ARRAY_INDEX' && typeof token.text !== 'string') return false
  if (token.kind === 'ARRAY_INDEX' && token.text.startsWith('[') === false) return false
  if (token.kind === 'ARRAY_INDEX' && token.text.endsWith(']') === false) return false
  if (token.kind === 'ARRAY_INDEX' && Number.parseInt(token.text.substring(1, token.text.length - 1)) !== token.value) return false

  return true
}

export type { Token, PropertyToken, ArrayIndexToken, TokenKind } from './types'
export { Tokens } from './Tokenizer'
