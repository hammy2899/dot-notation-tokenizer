import { FORBIDDEN_START_CHARACTERS, VALID_INDEX_CHARACTERS } from './consts'
import { ErrorMessage } from './errors'
import type { Token, TokenKind } from './types'

enum SegmentKind {
  START = 'START',
  PROPERTY = 'PROPERTY',
  ARRAY_INDEX = 'ARRAY_INDEX',
  ARRAY_INDEX_END = 'ARRAY_INDEX_END'
}

export class Tokenizer {
  private notationCharacters: string[] = []
  private segment: string = ''
  private segmentKind: SegmentKind = SegmentKind.START
  private index: number = 0
  private tokens: Token[] = []
  private skipNext: boolean = false

  private setup (): void {
    this.notationCharacters = []
    this.segment = ''
    this.segmentKind = SegmentKind.START
    this.index = 0
    this.tokens = []
    this.skipNext = false
  }

  public analyze (notation: string): Token[] {
    if (typeof notation !== 'string') {
      throw new TypeError('Notation argument must be a string')
    } else if (notation === '') {
      throw new TypeError('Notation argument can\'t be an empty string')
    }

    this.setup()
    this.notationCharacters = notation.split('')

    if (FORBIDDEN_START_CHARACTERS.includes(this.notationCharacters[0])) {
      throw new Error(ErrorMessage.INVALID_START_CHARACTER)
    }

    this.notationCharacters.forEach((character, index) => {
      this.index = index

      if (this.skipNext) {
        this.handleSkip(character)
      } else {
        switch (character) {
          case '\\': {
            this.handleEscape(character)
            break
          }
          case '.': {
            this.handleSeparator()
            break
          }
          case '[': {
            this.handleIndexStart()
            break
          }
          case ']': {
            this.handleIndexEnd(character)
            break
          }
          default: {
            this.handleDefault(character)
          }
        }
      }
    })

    if (this.segmentKind === SegmentKind.PROPERTY) {
      this.pushToken(
        'PROPERTY',
        this.segment,
        this.notationCharacters.length,
        this.segment.length
      )
    } else if (this.segmentKind === SegmentKind.ARRAY_INDEX) {
      throw new Error(ErrorMessage.ARRAY_INDEX_NOT_CLOSED)
    }

    return this.tokens
  }

  private handleSkip (character: string): void {
    this.segment += character
    this.skipNext = false
  }

  private handleEscape (character: string): void {
    if (this.segmentKind === SegmentKind.ARRAY_INDEX) {
      throw new Error(ErrorMessage.INVALID_CHARACTER_IN_ARRAY_INDEX)
    } else if (this.segmentKind === SegmentKind.ARRAY_INDEX_END) {
      throw new Error(ErrorMessage.INVALID_CHARACTER_AFTER_ARRAY_INDEX)
    }

    this.segment += character
    this.skipNext = true
  }

  private handleSeparator (): void {
    if (this.segmentKind === SegmentKind.ARRAY_INDEX) {
      throw new Error(ErrorMessage.INVALID_CHARACTER_IN_ARRAY_INDEX)
    } else if (this.segmentKind === SegmentKind.ARRAY_INDEX_END) {
      this.segmentKind = SegmentKind.PROPERTY
      this.segment = ''
    } else {
      if (this.segment === '') {
        throw new Error(ErrorMessage.PROPERTY_CANT_BE_EMPTY)
      }

      this.pushToken(
        'PROPERTY',
        this.segment,
        this.index,
        this.segment.length
      )
      this.segment = ''
      this.segmentKind = SegmentKind.PROPERTY
    }
  }

  private handleIndexStart (): void {
    if (this.segmentKind === SegmentKind.ARRAY_INDEX) {
      throw new Error(ErrorMessage.INVALID_CHARACTER_IN_ARRAY_INDEX)
    } else if (this.segmentKind === SegmentKind.PROPERTY) {
      this.pushToken(
        'PROPERTY',
        this.segment,
        this.index,
        this.segment.length
      )
      this.segment = ''
    }

    this.segmentKind = SegmentKind.ARRAY_INDEX
  }

  private handleIndexEnd (character: string): void {
    if (this.segmentKind === SegmentKind.ARRAY_INDEX) {
      this.pushToken(
        'ARRAY_INDEX',
        Number.parseInt(this.segment, 10),
        this.index + 1,
        this.segment.length + 1
      )
      this.segment = ''
      this.segmentKind = SegmentKind.ARRAY_INDEX_END
    } else if (this.segmentKind === SegmentKind.ARRAY_INDEX_END) {
      throw new Error(ErrorMessage.INVALID_CHARACTER_AFTER_ARRAY_INDEX)
    } else {
      this.segment += character
    }
  }

  private handleDefault (character: string): void {
    if (this.segmentKind === SegmentKind.ARRAY_INDEX && !VALID_INDEX_CHARACTERS.includes(character)) {
      throw new Error(ErrorMessage.INVALID_CHARACTER_IN_ARRAY_INDEX)
    } else if (this.segmentKind === SegmentKind.ARRAY_INDEX_END) {
      throw new Error(ErrorMessage.INVALID_CHARACTER_AFTER_ARRAY_INDEX)
    } else {
      if (this.segmentKind === SegmentKind.START) {
        this.segmentKind = SegmentKind.PROPERTY
      }

      this.segment += character
    }
  }

  private pushToken (kind: TokenKind, value: string | number, index: number, length: number): void {
    const token: any = {
      kind,
      value,
      index: {
        start: index - length,
        end: index
      }
    }

    if (token.kind === 'ARRAY_INDEX') {
      token.text = `[${String(value)}]`
    }

    this.tokens.push(token)
  }
}
