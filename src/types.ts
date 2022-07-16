export type TokenType = 'KEY' | 'ARRAY_INDEX'

export type TokenizerParts = 'START' | 'KEY' | 'ARRAY_INDEX' | 'ARRAY_INDEX_END'

export interface BaseToken {
  kind: TokenType
  index: number
  length: number
}

export interface KeyToken extends BaseToken {
  kind: 'KEY'
  value: string
}

export interface ArrayIndexToken extends BaseToken {
  kind: 'ARRAY_INDEX'
  value: number
}

export type Token = KeyToken | ArrayIndexToken

export type NotationTokens = Token[]
