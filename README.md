# dot-notation-tokenizer

Convert a dot notation string into a tokenized array.

---

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/hammy2899/dot-notation-tokenizer/CI)
[![Coverage Status](https://coveralls.io/repos/github/hammy2899/dot-notation-tokenizer/badge.svg?branch=main)](https://coveralls.io/github/hammy2899/dot-notation-tokenizer?branch=main)
![npm](https://img.shields.io/npm/v/dot-notation-tokenizer)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![License](https://img.shields.io/github/license/hammy2899/dot-notation-tokenizer)

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
    "kind": "KEY",
    "value": "path",
    "index": 0,
    "length": 4
  },
  {
    "kind": "KEY",
    "value": "to",
    "index": 5,
    "length": 2
  },
  {
    "kind": "KEY",
    "value": "array",
    "index": 8,
    "length": 5
  },
  {
    "kind": "ARRAY_INDEX",
    "value": 0,
    "index": 14,
    "length": 1
  }
]
```

The notation used above would be used to access the second value in the following object.

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
