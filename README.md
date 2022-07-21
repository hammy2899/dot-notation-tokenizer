# dot-notation-tokenizer

Convert a dot notation string into a tokenized array.

---

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/hammy2899/dot-notation-tokenizer/CI)](https://github.com/hammy2899/dot-notation-tokenizer/actions)
[![Coverage Status](https://coveralls.io/repos/github/hammy2899/dot-notation-tokenizer/badge.svg?branch=main)](https://coveralls.io/github/hammy2899/dot-notation-tokenizer?branch=main)
[![npm](https://img.shields.io/npm/v/dot-notation-tokenizer)](https://www.npmjs.com/package/dot-notation-tokenizer)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![License](https://img.shields.io/github/license/hammy2899/dot-notation-tokenizer)](https://github.com/hammy2899/dot-notation-tokenizer/blob/main/LICENSE)

### Installation

yarn
```bash
yarn add dot-notation-tokenizer
```

npm
```bash
npm i dot-notation-tokenizer
```

<br />

### Usage

#### JavaScript ES / TypeScript
```javascript
import { tokenize } from 'dot-notation-tokenizer'

tokenize('dot.notation')
```

#### Browser
```html
<script src="path/to/script/index.min.js"></script>

<script>
  dotNotationTokenizer.tokenize('dot.notation')
</script>
```

#### NodeJS
```javascript
const { tokenize } = require('dot-notation-tokenizer')

tokenize('dot.notation')
```

<br />

### Explanation

Dot notation can consist of basic property keys seperated by a `.` and also array indexes within `[x]` like the following.

```text
path.to.array[1]
```

The above notation would return the following token array.

```json
[
  {
    "kind": "PROPERTY",
    "value": "path",
    "index": {
      "start": 0,
      "end": 4
    },
    "raw": "path"
  },
  {
    "kind": "PROPERTY",
    "value": "to",
    "index": {
      "start": 5,
      "end": 7
    },
    "raw": "to"
  },
  {
    "kind": "PROPERTY",
    "value": "array",
    "index": {
      "start": 8,
      "end": 13
    },
    "raw": "array"
  },
  {
    "kind": "ARRAY_INDEX",
    "value": 1,
    "index": {
      "start": 14,
      "end": 16
    },
    "text": "[1]"
  }
]
```

The notation used above would be used to access the second array value in the following object.

The value returned would be `2`.

```json
{
  "path": {
    "to": {
      "array": [
        1,
        2,
        3
      ]
    }
  }
}
```

You can also chain array indexes for nested arrays like the following notation.

```text
path.to.deep.array[1][0][4]
```

#### Escaping characters

If you need to include `.`, `[` or `]` in your array key you can simply escape it by putting a slash `\` in front of the character.

```text
escaped\\.property\\[0\\].withindex
```

The above notation would return the following tokens.

```json
[
  {
    "kind": "PROPERTY",
    "value": "escaped.property[0]",
    "index": {
      "start": 0,
      "end": 22
    },
    "raw": "escaped\\.property\\[0\\]"
  },
  {
    "kind": "PROPERTY",
    "value": "withindex",
    "index": {
      "start": 23,
      "end": 32
    },
    "raw": "withindex"
  }
]
```
