import path from 'node:path'
import typescript from 'rollup-plugin-typescript2'
import esbuild from 'rollup-plugin-esbuild'
import packageJson from './package.json'

const TSCONFIG_PATH = path.resolve(__dirname, 'tsconfig.json')
const BASE_OUTPUT = {
  exports: 'named',
  sourcemap: true,
  name: 'dotNotationTokenizer'
}

const BASE_TYPESCRIPT_OPTIONS = {
  tsconfig: TSCONFIG_PATH,
  tsconfigOverride: {
    compilerOptions: {
      target: 'ESNext',
      module: 'ESNext',
      declaration: true
    },
    exclude: ['**/*.test.ts']
  }
}

const BASE_ESBUILD_OPTIONS = {
  tsconfig: TSCONFIG_PATH,
  banner: `/* dot-notation-tokenizer - v${packageJson.version}\n *\n * Released under MIT license\n * https://github.com/hammy2899/dot-notation-tokenizer\n */\n`
}

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: 'src/index.ts',
    output: [
      { ...BASE_OUTPUT, file: 'dist/index.js', format: 'umd' },
      { ...BASE_OUTPUT, file: 'dist/index.cjs', format: 'cjs' },
      { ...BASE_OUTPUT, file: 'dist/index.mjs', format: 'es' }
    ],
    plugins: [
      typescript(BASE_TYPESCRIPT_OPTIONS),
      esbuild(BASE_ESBUILD_OPTIONS)
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      ...BASE_OUTPUT,
      file: 'dist/index.min.js',
      format: 'umd'
    },
    plugins: [
      typescript(BASE_TYPESCRIPT_OPTIONS),
      esbuild({
        ...BASE_ESBUILD_OPTIONS,
        minify: true
      })
    ]
  }
]
