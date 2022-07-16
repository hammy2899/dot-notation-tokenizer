import { Tokenizer } from './Tokenizer'
import type { Token } from './types'

export function tokenize (notation: string): Token[] {
  const tokenizer = new Tokenizer()
  return tokenizer.analyze(notation)
}

export type { Token, PropertyToken, ArrayIndexToken, TokenKind } from './types'
