export type TokenKind = 'PROPERTY' | 'ARRAY_INDEX'

export interface BaseToken {
  kind: TokenKind
  index: {
    start: number
    end: number
  }
}

export interface PropertyToken extends BaseToken {
  kind: 'PROPERTY'
  value: string
}

export interface ArrayIndexToken extends BaseToken {
  kind: 'ARRAY_INDEX'
  value: number
  text: `[${string}]`
}

export type Token = PropertyToken | ArrayIndexToken
